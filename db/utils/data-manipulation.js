// extract any functions you are using to manipulate your data, into this file
exports.createLookup = (data, key, value) => {
  return data.reduce((acc, cur) => {
    acc[cur[key]] = cur[value]
    return acc
  }, {})
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
    dataClone.author = dataElement.created_by;

    delete dataClone.created_by;
    delete dataClone.belongs_to;

    return dataClone;
  });
};