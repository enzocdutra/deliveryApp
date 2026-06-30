export const STORE_HOURS = {
  openHour: 19,
  closeHour: 24,
  label: '19h às 00h',
};

export function isStoreOpen(date = new Date()) {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const openMinutes = STORE_HOURS.openHour * 60;
  const closeMinutes = STORE_HOURS.closeHour * 60;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function getStoreStatusMessage(date = new Date()) {
  return isStoreOpen(date)
    ? 'Aberto agora'
    : `Fechado no momento. Pedidos das ${STORE_HOURS.label}.`;
}

export function getClosedStoreMessage() {
  return `Estamos fechados no momento. Os pedidos funcionam das ${STORE_HOURS.label}.`;
}
