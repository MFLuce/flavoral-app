function formattedDate(d = new Date()) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return `${day}/${month}/${year}`;
}
const d = new Date("2021-10-13T12:46:17.000Z");
console.log(formattedDate(d));

module.exports = formattedDate;
