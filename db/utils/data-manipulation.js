// extract any functions you are using to manipulate your data, into this file
exports.createLookup = (data, key, value) => {
  const lookup = {};
  for (let i = 0; i < data.length; i++) {
    lookup[data[i][key]] = data[i][value];
  }
  return lookup;
};

exports.changeTimeFormat = (dataSet) => {
  return dataSet.map((dataElement) => {
    const dataClone = {...dataElement};
    const newTime = new Date(dataElement.created_at);
    dataClone.created_at = newTime;
    return dataClone;
  });
};

exports.formatComments = (data, lookup) => {
  return data.map((dataElement) => {
    const dataClone = {...dataElement};
    dataClone.article_id = lookup[dataClone.belongs_to];
    delete dataClone.belongs_to;
    return dataClone;
  });
};