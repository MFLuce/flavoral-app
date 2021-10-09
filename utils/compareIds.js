//To compare theses 2 Ids who objects, we must use the .toString method
//because 2 objects even if they are similar can't be === -> they have a diffrent place in memory
// So we have to transform them in string in order to compare them.
function compareIds(id1, id2) {
  return id1?.toString?.() === id2?.toString?.();
}

module.exports = compareIds;
