function parseMongooseError(errorStr) {
  if (!errorStr || typeof errorStr !== 'string') return 'An unknown error occurred';

  // Handle duplicate key errors (E11000)
  if (errorStr.includes('E11000') || errorStr.includes('duplicate key')) {
    const regex = /dup key: { (\w+): "(.+?)" }/g;
    const messages = [];
    let match;
    while ((match = regex.exec(errorStr)) !== null) {
      const field = capitalize(match[1]);
      const value = match[2];
      messages.push(`${field} "${value}" already exists. Please choose another or login if you are the owner.`);
    }
    if (messages.length) return messages.join(', ');
    return 'Duplicate key error. Please check your input.';
  }

  // Handle Mongoose validation errors in string form
  if (errorStr.includes('ValidationError')) {
    const regex = /path "(.*?)" is (.*?)(?:,|$)/g;
    const messages = [];
    let match;
    while ((match = regex.exec(errorStr)) !== null) {
      messages.push(`${capitalize(match[1])} ${match[2]}`);
    }
    if (messages.length) return messages.join(', ');
  }

  // Handle cast errors in string form
  if (errorStr.includes('Cast to')) {
    const regex = /Cast to (\w+) failed for value "(.*?)" at path "(.*?)"/;
    const match = errorStr.match(regex);
    if (match) {
      return `Invalid value for ${match[3]}: "${match[2]}"`;
    }
  }

  // Fallback: return the original string
  return errorStr;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default parseMongooseError;
