variable "domain" {
  default = "brawltime.ninja"
}

variable "basic_auth" {
}

job "traefik" {
  datacenters = ["dc1"]

  constraint {
    attribute = "${node.class}"
    value = "ingress"
  }

  # TODO zero-downtime-deployment
  # problem: port 80 can't be used twice

  group "traefik" {
    network {
      port "traefik_http" {
        static = 8088
      }

      port "traefik_ssh" {
        static = 2222
      }
    }

    service {
      name = "traefik"
      port = "traefik_http"

      check {
        type = "tcp"
        interval = "10s"
        timeout = "2s"
      }

      # 4646: default Nomad port
      # 8500: default Consul port
      tags = [
        "traefik.enable=true",
        "traefik.http.middlewares.auth.basicauth.users=${var.basic_auth}",

        "traefik.http.routers.traefik-dashboard.rule=Host(`traefik.${var.domain}`)",
        "traefik.http.routers.traefik-dashboard.service=api@internal",
        "traefik.http.routers.traefik-dashboard.middlewares=auth",

        "traefik.http.services.nomad-dashboard.loadbalancer.server.port=4646",
        "traefik.http.routers.nomad-dashboard.rule=Host(`nomad.${var.domain}`)",
        "traefik.http.routers.nomad-dashboard.service=nomad-dashboard",
        "traefik.http.routers.nomad-dashboard.middlewares=auth",

        "traefik.http.services.consul-dashboard.loadbalancer.server.port=8500",
        "traefik.http.routers.consul-dashboard.rule=Host(`consul.${var.domain}`)",
        "traefik.http.routers.consul-dashboard.service=consul-dashboard",
        "traefik.http.routers.consul-dashboard.middlewares=auth",
      ]
    }

    task "traefik" {
      driver = "docker"

      # TODO datadog does not receive anything?
      env {
        HOST_IP = "${attr.unique.network.ip-address}"
      }

      config {
        image = "traefik:v2.5"
        network_mode = "host"

        volumes = [
          "local/traefik.toml:/etc/traefik/traefik.toml:ro",
        ]
      }

      template {
        data = file("./conf/traefik.toml.tpl")
        destination = "local/traefik.toml"
        # traefik watches the config automatically
        change_mode = "noop"
      }

      resources {
        # average cpu: 96
        cpu = 256
        memory = 64
        memory_max = 384
      }
    }
  }
}