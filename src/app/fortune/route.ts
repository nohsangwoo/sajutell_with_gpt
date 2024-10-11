import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface UserInput {
  name: string
  birthDate: string
  isLunar: boolean
  gender: '남' | '여'
  birthTime?: string
  interests: string[]
}

interface FortuneSection {
  title: string
  content: string
}

export async function POST(request: Request) {
  const body: UserInput = await request.json()
  const { name, birthDate, isLunar, gender, birthTime, interests } = body

  if (!name || !birthDate || !gender || interests.length === 0) {
    return NextResponse.json(
      { message: '필수 정보가 누락되었습니다.' },
      { status: 400 },
    )
  }

  const calendarType = isLunar ? '음력' : '양력'
  const interestsString = interests.join(', ')

  const prompt = `Based on the following information, provide a detailed and personalized fortune-telling in Korean:
Name: ${name}
Date of Birth: ${birthDate} (${
    calendarType === '음력' ? 'Lunar calendar' : 'Solar calendar'
  })
Gender: ${gender === '남' ? 'Male' : 'Female'}
Time of Birth: ${birthTime ?? 'Unknown'}
Areas of Interest: ${interestsString}

Please provide a comprehensive and detailed fortune reading covering only the specified areas of interest. Structure your response in the following format:

[총운]
(Provide a detailed overall fortune for the year, about 150-200 words)

${
  interests.includes('사업운')
    ? `[사업운]
(Provide a detailed business fortune, about 150-200 words)
`
    : ''
}

${
  interests.includes('금전운')
    ? `[금전운]
(Provide a detailed financial fortune, about 150-200 words)
`
    : ''
}

${
  interests.includes('연애운')
    ? `[연애운]
(Provide a detailed love and relationship fortune, about 150-200 words)
`
    : ''
}

${
  interests.includes('건강운')
    ? `[건강운]
(Provide a detailed health fortune, about 150-200 words)
`
    : ''
}

${
  interests.includes('학업운')
    ? `[학업운]
(Provide a detailed academic fortune, about 150-200 words)
`
    : ''
}

The response should be entirely in Korean, tailored to the individual's information provided above. Each section should be detailed, informative, and specific to the individual. Use poetic and mystical language typical of traditional fortune-telling, but ensure the content is clear and meaningful. Include specific advice or guidance in each section.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are a professional fortune teller specializing in Korean traditional astrology. Provide detailed and personalized fortune-telling based on the user's information. Your responses should always be in Korean and follow the specified format.",
        },
        { role: 'user', content: prompt },
      ],
    })

    const fortune = completion.choices[0].message.content
    if (!fortune) {
      return NextResponse.json(
        { message: '운세를 가져오는 중 오류가 발생했습니다.' },
        { status: 500 },
      )
    }
    const parsedFortune = parseFortune(fortune)
    return NextResponse.json({ fortune: parsedFortune })
  } catch (error) {
    console.error('Error fetching fortune:', error)
    return NextResponse.json(
      { message: '운세를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}

function parseFortune(fortune: string): FortuneSection[] {
  const sections = fortune.split(/\[(.+?)\]\n/).filter(Boolean)
  const parsedSections: FortuneSection[] = []

  for (let i = 0; i < sections.length; i += 2) {
    parsedSections.push({
      title: sections[i],
      content: sections[i + 1].trim(),
    })
  }

  return parsedSections
}
