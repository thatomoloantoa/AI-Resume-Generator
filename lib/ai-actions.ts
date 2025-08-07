import { ParsedResume } from '@/app/page'

// Mock AI function that simulates resume generation
export async function generateResumeFromText(inputText: string): Promise<ParsedResume> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Parse basic information from the input text
  const lines = inputText.split('\n').filter(line => line.trim())
  
  // Extract name (usually first line or look for name patterns)
  const nameMatch = inputText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m) || 
                   inputText.match(/Name:?\s*([A-Z][a-z]+ [A-Z][a-z]+)/i)
  const fullName = nameMatch ? nameMatch[1] : 'Professional Name'
  
  // Extract email
  const emailMatch = inputText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
  const email = emailMatch ? emailMatch[1] : 'email@example.com'
  
  // Extract phone - Fixed regex pattern
  const phoneMatch = inputText.match(/(\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/i)
  const phone = phoneMatch ? phoneMatch[1] : '(555) 123-4567'
  
  // Extract location
  const locationMatch = inputText.match(/([A-Z][a-z]+,?\s+[A-Z]{2})/i) ||
                       inputText.match(/(San Francisco|New York|Los Angeles|Chicago|Boston|Seattle|Austin|Denver|Miami|Atlanta|Dallas|Phoenix)/i)
  const location = locationMatch ? locationMatch[1] : 'City, State'
  
  // Extract LinkedIn
  const linkedinMatch = inputText.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i) ||
                       inputText.match(/linkedin:?\s*([a-zA-Z0-9-]+)/i)
  const linkedin = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : undefined
  
  // Extract website
  const websiteMatch = inputText.match(/(https?:\/\/[^\s]+)/i) ||
                      inputText.match(/([a-zA-Z0-9-]+\.(com|dev|io|net|org))/i)
  const website = websiteMatch ? websiteMatch[1] : undefined
  
  // Generate professional summary based on input content
  let summary = `Experienced professional with a proven track record of delivering high-quality results and driving innovation. Skilled in multiple technologies and methodologies with strong leadership and problem-solving abilities. Passionate about creating efficient solutions and contributing to team success.`
  
  // Try to create a more personalized summary based on input
  if (inputText.toLowerCase().includes('engineer')) {
    summary = `Experienced software engineer with expertise in developing scalable applications and systems. Proven ability to lead technical projects, optimize performance, and collaborate effectively with cross-functional teams to deliver innovative solutions.`
  } else if (inputText.toLowerCase().includes('manager')) {
    summary = `Results-driven manager with strong leadership skills and experience in driving team performance and project success. Expertise in strategic planning, process optimization, and fostering collaborative work environments.`
  } else if (inputText.toLowerCase().includes('designer')) {
    summary = `Creative designer with a passion for user-centered design and visual storytelling. Experienced in creating compelling designs that enhance user experience and drive business objectives through innovative design solutions.`
  }
  
  // Try to extract actual information from input if available
  const actualExperiences = extractExperiences(inputText)
  const actualEducation = extractEducation(inputText)
  const actualSkills = extractSkills(inputText)
  
  // Mock experiences based on common patterns
  const defaultExperiences = [
    {
      company: "Tech Company Inc.",
      position: "Senior Software Engineer",
      duration: "2021 - Present",
      description: "• Led development of scalable web applications serving 100K+ users\n• Improved system performance by 40% through optimization and refactoring\n• Mentored junior developers and established coding best practices\n• Collaborated with cross-functional teams to deliver features on time"
    },
    {
      company: "Innovation Labs",
      position: "Software Engineer",
      duration: "2019 - 2021",
      description: "• Developed and maintained RESTful APIs and microservices\n• Implemented automated testing strategies, reducing bugs by 30%\n• Participated in agile development processes and code reviews\n• Built responsive user interfaces using modern frameworks"
    }
  ]
  
  // Mock education
  const defaultEducation = [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      duration: "2015 - 2019",
      gpa: "3.7"
    }
  ]
  
  // Mock skills based on common tech skills
  const defaultSkills = [
    "JavaScript", "Python", "React", "Node.js", "AWS", "Docker", 
    "PostgreSQL", "Git", "Agile Methodologies", "Problem Solving",
    "Team Leadership", "System Design"
  ]
  
  return {
    personalInfo: {
      fullName,
      email,
      phone,
      location,
      linkedin,
      website,
      summary
    },
    experiences: actualExperiences.length > 0 ? actualExperiences : defaultExperiences,
    education: actualEducation.length > 0 ? actualEducation : defaultEducation,
    skills: actualSkills.length > 0 ? actualSkills : defaultSkills
  }
}

function extractExperiences(text: string) {
  const experiences = []
  const lines = text.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Look for job titles and companies
    if (line.match(/(engineer|developer|manager|analyst|designer|consultant|director|lead)/i)) {
      
      // Try different patterns for job descriptions
      const atMatch = line.match(/(.+?)\s+(?:at|@)\s+([A-Z][a-zA-Z\s&.,]+)/i)
      const pipeMatch = line.match(/(.+?)\s*\|\s*([A-Z][a-zA-Z\s&.,]+)/i)
      const dashMatch = line.match(/(.+?)\s*[-–]\s*([A-Z][a-zA-Z\s&.,]+)/i)
      
      const match = atMatch || pipeMatch || dashMatch
      
      if (match) {
        const position = match[1].trim()
        const company = match[2].trim()
        
        // Look for duration in nearby lines or same line
        let duration = "2020 - 2023"
        
        // Check current line first
        const currentLineDuration = line.match(/(\d{4}[-\s]*(?:to|-)?\s*(?:\d{4}|present|current))/i)
        if (currentLineDuration) {
          duration = currentLineDuration[1]
        } else {
          // Check nearby lines
          for (let j = Math.max(0, i-2); j < Math.min(lines.length, i+3); j++) {
            const durationMatch = lines[j].match(/(\d{4}[-\s]*(?:to|-)?\s*(?:\d{4}|present|current))/i)
            if (durationMatch) {
              duration = durationMatch[1]
              break
            }
          }
        }
        
        // Look for description in following lines
        let description = "• Contributed to key projects and initiatives\n• Collaborated with team members to achieve goals\n• Applied technical skills to solve complex problems"
        
        const descriptionLines = []
        for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
          const nextLine = lines[j].trim()
          if (nextLine && !nextLine.match(/^\d{4}/) && !nextLine.match(/(engineer|developer|manager)/i)) {
            if (nextLine.startsWith('•') || nextLine.startsWith('-') || nextLine.length > 20) {
              descriptionLines.push(nextLine.startsWith('•') ? nextLine : `• ${nextLine}`)
            }
          } else {
            break
          }
        }
        
        if (descriptionLines.length > 0) {
          description = descriptionLines.join('\n')
        }
        
        experiences.push({
          company,
          position,
          duration,
          description
        })
      }
    }
  }
  
  return experiences
}

function extractEducation(text: string) {
  const education = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    if (line.match(/(bachelor|master|phd|degree|university|college|bs|ms|ba|ma)/i)) {
      let degree = "Bachelor of Science"
      let field = "Computer Science"
      let institution = "University"
      let duration = "2015 - 2019"
      let gpa = undefined
      
      // Extract degree type
      const degreeMatch = line.match(/(bachelor|master|phd|bs|ms|ba|ma).*?(?:of|in)\s+([a-zA-Z\s]+)/i)
      if (degreeMatch) {
        degree = degreeMatch[1].includes('master') || degreeMatch[1].toLowerCase() === 'ms' || degreeMatch[1].toLowerCase() === 'ma' 
          ? "Master's Degree" : "Bachelor's Degree"
        field = degreeMatch[2].trim()
      }
      
      // Extract institution
      const schoolMatch = line.match(/(?:from|at)\s+([A-Z][a-zA-Z\s]+(?:university|college|institute))/i) ||
                         line.match(/([A-Z][a-zA-Z\s]+(?:university|college|institute))/i)
      if (schoolMatch) {
        institution = schoolMatch[1].trim()
      }
      
      // Extract duration
      const durationMatch = line.match(/(\d{4}[-\s]*(?:to|-)?\s*\d{4})/i)
      if (durationMatch) {
        duration = durationMatch[1]
      }
      
      // Extract GPA
      const gpaMatch = line.match(/gpa:?\s*(\d\.\d)/i)
      if (gpaMatch) {
        gpa = gpaMatch[1]
      }
      
      education.push({
        institution,
        degree,
        field,
        duration,
        gpa
      })
    }
  }
  
  return education
}

function extractSkills(text: string) {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
    'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'C++', 'C#',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQL',
    'Git', 'Agile', 'Scrum', 'REST', 'GraphQL', 'API',
    'Machine Learning', 'Data Science', 'AI', 'DevOps',
    'Project Management', 'Leadership', 'Communication'
  ]
  
  const foundSkills = []
  const textLower = text.toLowerCase()
  
  for (const skill of commonSkills) {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill)
    }
  }
  
  // Also look for skills mentioned in a skills section
  const skillsSection = text.match(/skills?:?\s*([^\n]+)/i)
  if (skillsSection) {
    const skillsList = skillsSection[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0)
    foundSkills.push(...skillsList)
  }
  
  // Remove duplicates and return
  return [...new Set(foundSkills)]
}
