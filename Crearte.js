document.addEventListener("DOMContentLoaded", () => {
  const statusMessage = document.getElementById("status-message");
  const ctaButton = document.querySelector(".btn-primary");

  if (ctaButton && statusMessage) {
    ctaButton.addEventListener("click", () => {
      statusMessage.textContent = "¡Estamos listos para crear algo increíble contigo!";
    });
  }
});
