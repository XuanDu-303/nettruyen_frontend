export function timeAgo(input, format = 'auto') {
  let timestamp;

  if (format === 'timestamp') {
    if (typeof input !== 'number') {
      throw new Error('Input must be a number when format is "timestamp".');
    }
    timestamp = input;
  } else if (format === 'ISO') {
    if (typeof input !== 'string' || isNaN(Date.parse(input))) {
      throw new Error('Input must be a valid ISO 8601 string when format is "ISO".');
    }
    timestamp = Date.parse(input);
  } else if (format === 'YYYYMMDD') {
    if (typeof input !== 'string' || !/^\d{8}$/.test(input)) {
      throw new Error('Input must be a string in "YYYYMMDD" format.');
    }
    const year = parseInt(input.substring(0, 4), 10);
    const month = parseInt(input.substring(4, 6), 10) - 1;
    const day = parseInt(input.substring(6, 8), 10);
    timestamp = new Date(year, month, day).getTime();
  } else if (format === 'auto') {
    if (typeof input === 'number') {
      timestamp = input;
    } else if (typeof input === 'string') {
      if (/^\d{8}$/.test(input)) {
        const year = parseInt(input.substring(0, 4), 10);
        const month = parseInt(input.substring(4, 6), 10) - 1;
        const day = parseInt(input.substring(6, 8), 10);
        timestamp = new Date(year, month, day).getTime();
      } else {
        timestamp = Date.parse(input);
      }
    } else {
      throw new Error('Input must be a number (timestamp), an ISO 8601 string, or a string in "YYYYMMDD" format.');
    }
  } else {
    throw new Error('Invalid format specified. Use "timestamp", "ISO", "YYYYMMDD", or "auto".');
  }

  const now = Date.now();
  const diffInMs = now - timestamp;

  const diffInSeconds = diffInMs / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  const diffInWeeks = diffInDays / 7;
  const diffInMonths = diffInDays / 30;
  const diffInYears = diffInMonths / 12;

  if (diffInYears >= 1) {
    return `${Math.floor(diffInYears)} năm trước`;
  } else if (diffInMonths >= 1) {
    return `${Math.floor(diffInMonths)} tháng trước`;
  } else if (diffInWeeks >= 1) {
    return `${Math.floor(diffInWeeks)} tuần trước`;
  } else if (diffInDays >= 1) {
    return `${Math.floor(diffInDays)} ngày trước`;
  } else if (diffInHours >= 1) {
    return `${Math.floor(diffInHours)} giờ trước`;
  } else if (diffInMinutes >= 1) {
    return `${Math.floor(diffInMinutes)} phút trước`;
  } else {
    return "Vừa mới";
  }
}

export const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// const updatedAt = "2024-07-22T10:51:55.295Z";
