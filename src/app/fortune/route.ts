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
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const formattedCurrentDate = currentDate.toISOString().split('T')[0]

  const prompt = `Based on the following information, provide a detailed and personalized fortune-telling:

Name: ${name}
Date of Birth: ${birthDate} (${
    calendarType === '음력' ? 'Lunar calendar' : 'Solar calendar'
  })
Gender: ${gender}
Time of Birth: ${birthTime ?? 'Unknown'}
Areas of Interest: ${interestsString}
Current Date: ${formattedCurrentDate}
Current Year: ${currentYear}

Please provide a comprehensive and detailed fortune reading in Korean, covering only the specified areas of interest. Structure your response in the following format, with each section containing about 200-250 words:

[전체 운세]
(Provide a detailed overall fortune for the year ${currentYear})

${interests
  .map(
    interest => `
[${interest}]
(Provide a detailed fortune for ${interest}, including specific advice and guidance)
`,
  )
  .join('')}

Please ensure that your response adheres to the following guidelines:
1. The entire response should be in Korean, despite this prompt being in English.
2. Tailor the fortune to the individual's information provided above.
3. Each section should be detailed, informative, and specific to the individual.
4. Use poetic and mystical language typical of traditional fortune-telling, but ensure the content is clear and meaningful.
5. Include specific advice or guidance in each section that the reader can empathize with and apply to their life.
6. Consider the person's date of birth in relation to the current year.
7. Provide gender-specific advice where relevant.
8. Offer in-depth analysis for each selected area of interest.
9. Reflect current social and economic situations in your practical advice.
10. Provide insights into the individual's potential and challenges.

Your response should be comprehensive, allowing the reader to deeply connect with the content and apply it to their real-life situations.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
