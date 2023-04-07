export default function dateformat(oldformat) {
  let timestamp = new Date(oldformat).getTime();
  let Day = new Date(timestamp).getDate();
  let Month = new Date(timestamp).getMonth() + 1;
  let Year = new Date(timestamp).getFullYear();
  let newFormat = `${Day}/${Month}/${Year}`;
  return newFormat;
}