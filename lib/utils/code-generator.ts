export function generateShareCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function isValidShareCode(code: string): boolean {
  return /^\d{4}$/.test(code)
}