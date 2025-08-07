'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Download, FileText, Sparkles, Loader2 } from 'lucide-react'
import { ResumePreview } from '@/components/resume-preview'
import { generateResumeFromText } from '@/lib/ai-actions'
import { useToast } from '@/hooks/use-toast'

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  website?: string
  summary: string
}

export interface Experience {
  company: string
  position: string
  duration: string
  description: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  duration: string
  gpa?: string
}

export interface ParsedResume {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: string[]
}

export default function ResumeBuilder() {
  const { toast } = useToast()
  const [inputText, setInputText] = useState('')
  const [generatedResume, setGeneratedResume] = useState<ParsedResume | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateResume = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your information to generate a resume.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const resume = await generateResumeFromText(inputText)
      setGeneratedResume(resume)
      toast({
        title: "Resume Generated!",
        description: "Your professional resume has been created successfully.",
      })
    } catch (error) {
      console.error('Error generating resume:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const exportResume = () => {
    if (!generatedResume) return

    const resumeText = `
${generatedResume.personalInfo.fullName}
${generatedResume.personalInfo.email} | ${generatedResume.personalInfo.phone}
${generatedResume.personalInfo.location}
${generatedResume.personalInfo.linkedin ? `LinkedIn: ${generatedResume.personalInfo.linkedin}` : ''}
${generatedResume.personalInfo.website ? `Website: ${generatedResume.personalInfo.website}` : ''}

PROFESSIONAL SUMMARY
${generatedResume.personalInfo.summary}

PROFESSIONAL EXPERIENCE
${generatedResume.experiences.map(exp => `
${exp.position} | ${exp.company}
${exp.duration}
${exp.description}
`).join('\n')}

EDUCATION
${generatedResume.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.institution} | ${edu.duration}
${edu.gpa ? `GPA: ${edu.gpa}` : ''}
`).join('\n')}

SKILLS
${generatedResume.skills.join(' • ')}
    `
    
    const blob = new Blob([resumeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Resume Exported!",
      description: "Your resume has been downloaded successfully.",
    })
  }

  const exampleText = `John Smith
Software Engineer
john.smith@email.com
(555) 123-4567
San Francisco, CA
linkedin.com/in/johnsmith
johnsmith.dev

I'm a software engineer with 5 years of experience building scalable web applications. I've worked at tech companies like Google and Stripe, leading teams and improving system performance.

Work Experience:
- Senior Software Engineer at Google (2021-2024): Led a team of 4 developers, improved application performance by 40%, built microservices architecture
- Software Engineer at Stripe (2019-2021): Developed payment APIs, implemented fraud detection systems, reduced processing time by 25%
- Junior Developer at StartupXYZ (2018-2019): Built React applications, worked with REST APIs

Education:
- Bachelor of Science in Computer Science from Stanford University (2014-2018), GPA 3.8
- Relevant coursework: Data Structures, Algorithms, Database Systems

Skills: JavaScript, Python, React, Node.js, AWS, Docker, PostgreSQL, Git, Agile methodologies`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Resume Builder
          </h1>
          <p className="text-lg text-gray-600">
            Write your information once, get a professional resume instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="resume-input">
                    Enter all your information (name, contact, experience, education, skills, etc.)
                  </Label>
                  <Textarea
                    id="resume-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={exampleText}
                    className="min-h-[400px] mt-2"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={generateResume}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Professional Resume
                      </>
                    )}
                  </Button>
                  
                  {generatedResume && (
                    <Button onClick={exportResume} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  <p className="font-medium mb-1">💡 Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Include your name, contact info, and location</li>
                    <li>• List your work experience with companies and achievements</li>
                    <li>• Add your education background</li>
                    <li>• Mention your skills and technologies</li>
                    <li>• Write naturally - AI will make it professional!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedResume ? (
                  <ResumePreview data={generatedResume} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No resume generated yet</p>
                    <p className="text-sm">Enter your information and click "Generate Professional Resume" to see your resume here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
