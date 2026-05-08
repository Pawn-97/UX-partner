# Alternate Routing Configuration

> Sample PRD for smoke-testing the ux-project plugin. Not a real product requirement.

## Background

Customers running Zoom Phone alongside Zoom Contact Center occasionally need to redirect inbound calls between the two systems. Today this requires support intervention. We want to give admins a self-service way to configure and activate alternate routing.

## Proposal

Add a "Configure Alternate Routing" panel under **Phone System Management → Routing** with:

- A toggle to enable/disable alternate routing per site
- A dropdown to choose the destination (ZP queue or ZCC flow)
- A "Activate Now" button for emergency situations
- A history log of activations

## Goals

- Reduce time-to-route from 30+ minutes (with support ticket) to under 2 minutes
- Cover the top 3 carrier outage scenarios identified by the support team in Q1 2026
- Audit trail visible to compliance team

## Out of scope

- Routing logic between two ZCC instances
- BYOC carriers (separate workstream)
- End-user notifications (Phase 2)

## Open questions

- Should activation require a confirmation step?
- Who can deactivate alternate routing once activated?
- What happens to in-progress calls at the moment of switch?
