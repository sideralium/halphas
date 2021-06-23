const buff_to_b64 = (id: Buffer): string => Buffer.from(id).toString('base64');

export { buff_to_b64 }
