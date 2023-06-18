resource "nomad_job" "nginx" {
  jobspec = file("${path.module}/nginx.nomad")

  lifecycle {
    ignore_changes = [
      allocation_ids,
    ]
  }

  hcl2 {
    enabled = true
    allow_fs = true
  }
}

variable "basic_auth" {}

resource "nomad_job" "traefik" {
  jobspec = file("${path.module}/traefik.nomad")

  lifecycle {
    ignore_changes = [
      allocation_ids,
    ]
  }

  hcl2 {
    enabled = true
    allow_fs = true
    vars = {
      "basic_auth" = var.basic_auth
    }
  }
}

resource "hcloud_volume" "mariadb" {
  name = "mariadb-database"
  location = "nbg1"
  size = 10
  format = "ext4"
  delete_protection = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "nomad_volume" "mariadb" {
  depends_on = [data.nomad_plugin.hetzner]
  type = "csi"
  plugin_id = "csi.hetzner.cloud"

  volume_id = "mariadb-database"
  name = "mariadb-database"
  external_id = hcloud_volume.mariadb.id

  capability {
    access_mode = "single-node-writer"
    attachment_mode = "file-system"
  }
}

resource "nomad_job" "mariadb" {
  depends_on = [nomad_volume.mariadb]
  jobspec = file("${path.module}/mariadb.nomad")

  lifecycle {
    ignore_changes = [
      allocation_ids,
    ]
  }
}

resource "hcloud_volume" "clickhouse" {
  name = "clickhouse-database"
  location = "nbg1"
  size = 100
  format = "ext4"
  delete_protection = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "nomad_volume" "clickhouse" {
  depends_on = [data.nomad_plugin.hetzner]
  type = "csi"
  plugin_id = "csi.hetzner.cloud"

  volume_id = "clickhouse-database"
  name = "clickhouse-database"
  external_id = hcloud_volume.clickhouse.id

  capability {
    access_mode = "single-node-writer"
    attachment_mode = "file-system"
  }
}

resource "nomad_job" "clickhouse" {
  depends_on = [nomad_volume.clickhouse]
  jobspec = file("${path.module}/clickhouse.nomad")

  lifecycle {
    ignore_changes = [
      allocation_ids,
    ]
  }

  hcl2 {
    enabled = true
    allow_fs = true
  }
}

resource "nomad_job" "redis" {
  jobspec = file("${path.module}/redis.nomad")

  lifecycle {
    ignore_changes = [
      allocation_ids,
    ]
  }

  hcl2 {
    enabled = true
  }
}

variable "traduora_google_client_id" {}
variable "traduora_google_client_secret" {}
variable "traduora_secret" {}

resource "nomad_job" "traduora" {
  jobspec = file("${path.module}/traduora.nomad")

  lifecycle {
    ignore_changes = [
      allocation_ids,
    ]
  }

  hcl2 {
    enabled = true
    vars = {
      "traduora_google_client_id" = var.traduora_google_client_id
      "traduora_google_client_secret" = var.traduora_google_client_secret
      "traduora_secret" = var.traduora_secret
    }
  }
}

variable "brawlstars_email" {}
variable "brawlstars_password" {}
variable "brawlapi_token" {}
variable "brawltime_assets_pubkey" {}
variable "brawltime_assets_hostkey_ed" {}
variable "brawltime_assets_hostkey_rsa" {}

resource "hcloud_volume" "brawltime_assets" {
  name = "brawltime-assets"
  location = "nbg1"
  size = 10
  format = "ext4"
  delete_protection = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "nomad_volume" "brawltime_assets" {
  depends_on = [data.nomad_plugin.hetzner]
  type = "csi"
  plugin_id = "csi.hetzner.cloud"

  volume_id = "brawltime-assets"
  name = "brawltime-assets"
  external_id = hcloud_volume.brawltime_assets.id

  capability {
    access_mode = "single-node-writer"
    attachment_mode = "file-system"
  }
}
