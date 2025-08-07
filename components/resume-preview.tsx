import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react'
import { ParsedResume } from '@/app/page'

interface ResumePreviewProps {
  data: ParsedResume
}

export function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-h-[800px] overflow-y-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {data.personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {data.personalInfo.location}
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              {data.personalInfo.linkedin}
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {data.personalInfo.website}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {data.personalInfo.summary}
        </p>
      </div>

      {/* Experience */}
      {data.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experiences.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-600 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-blue-600 font-semibold">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {exp.duration}
                  </div>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {exp.description.split('\n').map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-green-600 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-green-600 font-semibold">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {edu.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
