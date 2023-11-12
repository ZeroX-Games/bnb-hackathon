function ellipsisLongId(id: string, startLength = 6, endLength = 4) {
  if (id.length <= startLength + endLength) {
    return id;
  }
  const start = id.substring(0, startLength);
  const end = id.substring(id.length - endLength);
  return `${start}...${end}`;
}

export default ellipsisLongId;
