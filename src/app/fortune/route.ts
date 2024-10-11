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

Please provide a comprehensive fortune reading covering the specified areas of interest. Structure your response in the following format:

[총운]
(Overall fortune for the year)

[사업운]
(Business fortune)

[금전운]
(Financial fortune)

[연애운]
(Love and relationship fortune)

[건강운]
(Health fortune)

The response should be entirely in Korean, tailored to the individual's information provided above. Each section should be concise but informative.`

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
