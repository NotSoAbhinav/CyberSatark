export interface PasswordAnalysis {
  score: number
  strength: string
  findings: string[]
}

export function analyzePassword(password: string): PasswordAnalysis {
  let score = 0
  const findings: string[] = []

  if (password.length >= 12) {
    score += 30
  } else {
    findings.push("Password is too short")
  }

  if (/[A-Z]/.test(password)) {
    score += 20
  } else {
    findings.push("Missing uppercase letter")
  }

  if (/[0-9]/.test(password)) {
    score += 20
  } else {
    findings.push("Missing number")
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 20
  } else {
    findings.push("Missing special character")
  }

  if (password.length >= 16) {
    score += 10
  }

  let strength = "Weak"

  if (score >= 70) {
    strength = "Strong"
  } else if (score >= 40) {
    strength = "Medium"
  }

  return {
    score,
    strength,
    findings
  }
}