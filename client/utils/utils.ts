type UnixTime = number;

export function timeAgo(ts: UnixTime): string {
  var now = Math.floor(Date.now() / 1000);
  var seconds = now - ts;

  const minutes = 60;
  const hour = minutes * 60;
  const day = hour * 24;
  const month = day * 30;

  if (seconds / month >= 1) {
    let date = new Date(ts * 1000);
    return `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
  }

  if (seconds / day >= 1) {
    return `${Math.floor(seconds / day)}d`;
  }

  if (seconds / hour >= 1) {
    return `${Math.floor(seconds / hour)}h`;
  }

  if (seconds / minutes >= 1) {
    return `${Math.floor(seconds / minutes)}m`;
  }

  return "1m";
}

export function timeToDate(ts: UnixTime): string {
  let date = new Date(ts * 1000);
  return `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
}
