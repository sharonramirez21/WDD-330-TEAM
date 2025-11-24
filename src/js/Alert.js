export default class Alert {
  constructor(
    sourceUrl = "/alerts.json",
    targetElement = document.querySelector("main"),
  ) {
    this.sourceUrl = sourceUrl;
    this.targetElement = targetElement;
  }

  async init() {
    const alerts = await this.loadAlerts();
    if (!alerts.length || !this.targetElement) return;

    const alertList = this.buildAlertList(alerts);
    if (!alertList || alertList.childElementCount === 0) return;

    this.targetElement.prepend(alertList);
  }

  async loadAlerts() {
    try {
      const response = await fetch(this.sourceUrl);
      if (!response.ok) {
        throw new Error(`Unable to load alerts: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  buildAlertList(alerts) {
    const alertList = document.createElement("section");
    alertList.classList.add("alert-list");

    alerts.forEach((alert) => {
      if (!alert?.message) return;

      const alertElement = document.createElement("p");
      alertElement.textContent = alert.message;

      if (alert.background) {
        alertElement.style.backgroundColor = alert.background;
      }
      if (alert.color) {
        alertElement.style.color = alert.color;
      }

      alertList.appendChild(alertElement);
    });

    return alertList;
  }
}
