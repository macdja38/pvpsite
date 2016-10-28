/**
 * Created by macdja38 on 2016-10-28.
 */

exports.toText = function toText(val) {
  return new Buffer(val, 'base64').toString();
};

exports.toBase64 = function toBase64(val) {
  return new Buffer(val).toString('base64');
};
