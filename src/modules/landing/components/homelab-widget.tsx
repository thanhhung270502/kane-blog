"use client";

import { Clock, Cpu, HardDrive, HardDrives, Network, Shield } from "@phosphor-icons/react";

import { ExpandableWidget, LiquidGlass } from ".";

export function HomelabWidget() {
  const stats = [
    { label: "Nodes", value: "3", icon: HardDrives },
    { label: "Storage", value: "8TB", icon: HardDrive },
    { label: "CPU Cores", value: "24", icon: Cpu },
  ];

  const detailedStats = [
    { label: "Nodes", value: "3", icon: HardDrives, detail: "Proxmox VE Cluster" },
    { label: "Storage", value: "8TB", icon: HardDrive, detail: "ZFS RAID-Z2" },
    { label: "CPU Cores", value: "24", icon: Cpu, detail: "Intel Xeon E5-2680" },
    { label: "Network", value: "10Gbps", icon: Network, detail: "Internal backbone" },
    { label: "VMs", value: "12", icon: Shield, detail: "Running containers" },
    { label: "Uptime", value: "99.9%", icon: Clock, detail: "Last 30 days" },
  ];

  const services = [
    "Kubernetes (K3s)",
    "Docker Swarm",
    "Nginx Reverse Proxy",
    "Pi-hole DNS",
    "Grafana Monitoring",
    "Home Assistant",
    "Plex Media Server",
    "NextCloud",
  ];

  const expandedContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-green-400">
        <span className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
        <span className="font-medium">All Systems Operational</span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {detailedStats.map(({ label, value, icon: Icon, detail }) => (
          <div key={label} className="rounded-xl bg-white/5 p-4 text-center">
            <Icon size={32} className="mx-auto mb-2 text-cyan-400" />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-white/60">{label}</p>
            <p className="mt-1 text-xs text-white/40">{detail}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="mb-3 text-lg font-semibold text-white">Running Services</h4>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-sm text-white/50">
          Self-hosted infrastructure for development and media
        </p>
      </div>
    </div>
  );

  return (
    <ExpandableWidget title="Homelab Status" expandedContent={expandedContent}>
      <LiquidGlass blur="lg" glow hoverable className="h-full p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Homelab Status</h3>
          <span className="flex items-center gap-2 text-sm text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Online
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon size={24} className="mx-auto mb-2 text-white/60" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </LiquidGlass>
    </ExpandableWidget>
  );
}
