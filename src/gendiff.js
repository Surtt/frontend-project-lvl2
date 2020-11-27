import lodash from 'lodash';

const {
  union, isObject, has, sortBy,
} = lodash;

const generateDiff = (data1, data2) => {
  const getDifference = (file1, file2, key) => {
    if (!has(file1, key)) {
      return { key, type: 'added', value: file2[key] };
    }
    if (!has(file2, key)) {
      return { key, type: 'removed', value: file1[key] };
    }
    if (isObject(file1[key]) && isObject(file2[key])) {
      return { key, type: 'nested', children: generateDiff(file1[key], file2[key]) };
    }
    if (file1[key] !== file2[key]) {
      return {
        key, type: 'changed', value1: file1[key], value2: file2[key],
      };
    }
    return { key, type: 'unchanged', value: file1[key] };
  };

  const keys = sortBy(union(Object.keys(data1), Object.keys(data2)));
  return keys.map((key) => getDifference(data1, data2, key));
};

export default generateDiff;
