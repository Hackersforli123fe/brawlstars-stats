job "clickhouse" {
  datacenters = ["dc1"]

  constraint {
    attribute = "${node.class}"
    value = "database"
  }

  priority = 100 # move all other services to get this one running!

  group "clickhouse" {
    stop_after_client_disconnect = "15m" # free up volume if disconnected from Nomad for a long time

    network {
      port "http" {
        static = 8123
      }

      port "tcp" {
        static = 9000
      }

      port "interserver" {
        static = 9009
      }
    }

    volume "clickhouse-volume" {
      type = "csi"
      source = "clickhouse-database"
      attachment_mode = "file-system"
      access_mode = "single-node-writer"
    }

    service {
      name = "clickhouse"
      port = "http"

      check {
        type = "http"
        path = "/ping"
        interval = "10s"
        timeout = "2s"

        check_restart {
          limit = 6
        }
      }
    }

    task "clickhouse" {
      driver = "docker"

      env {
        DATA_PATH = "/srv/clickhouse/"
        TMP_PATH = "/var/lib/clickhouse/tmp/"
      }

      volume_mount {
        volume = "clickhouse-volume"
        destination = "/srv"
      }

      config {
        image = "clickhouse/clickhouse-server:23.12-alpine"
        network_mode = "host"

        volumes = [
          "local/clickhouse.xml:/etc/clickhouse-server/config.d/config.xml:ro",
          "local/clickhouse-users.xml:/etc/clickhouse-server/users.d/users.xml:ro",
        ]

        ports = ["http", "tcp", "interserver"]

        ulimit {
          nofile = "262144:262144"
        }
        # TODO allow these in the Nomad configuration
        # https://www.nomadproject.io/docs/drivers/docker#allow_caps
        #cap_add = ["sys_nice", "net_admin", "ipc_lock"]

        labels = {
          "com.datadoghq.ad.check_names" = jsonencode(["clickhouse"])
          "com.datadoghq.ad.init_configs" = jsonencode([{}])
          "com.datadoghq.ad.instances" = jsonencode([{
            server = "${NOMAD_IP_tcp}",
          }])
        }
      }

      template {
        data = file("./conf/clickhouse/clickhouse.xml.tpl")
        destination = "local/clickhouse.xml"
      }

      template {
        data = file("./conf/clickhouse/clickhouse-users.xml.tpl")
        destination = "local/clickhouse-users.xml"
      }

      resources {
        cpu = 4096 # peaks up to max capacity
        memory = 12288
        memory_max = 14336
      }
    }
  }
}
