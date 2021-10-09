function formatedDate(dbDate) {
  let month = String(dbDate.getMonth() + 1);
  let day = String(dbDate.getDate());
  const year = String(dbDate.getFullYear());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return `${day}/${month}/${year}`;
}
module.exports = formatedDate;
