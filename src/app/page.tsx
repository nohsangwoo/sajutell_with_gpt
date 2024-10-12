'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parse } from 'date-fns';
import { Select, Tag } from 'antd';
import { FaSpinner } from 'react-icons/fa';

const { Option } = Select;

const interestOptions = [
  { value: '재물운', label: '재물운' },  // 돈과 재물에 관한 운
  { value: '사업운', label: '사업운' },  // 사업 및 직업과 관련된 운
  { value: '연애운', label: '연애운' },  // 연애와 사랑에 관련된 운
  { value: '건강운', label: '건강운' },  // 건강과 관련된 운
  { value: '학업운', label: '학업운' },  // 학업과 지식, 공부에 관련된 운
  { value: '결혼운', label: '결혼운' },  // 결혼과 관련된 운
  { value: '자녀운', label: '자녀운' },  // 자녀와 관련된 운
  { value: '인연운', label: '인연운' },  // 인간관계와 인연에 관련된 운
  { value: '승진운', label: '승진운' },  // 직장에서의 승진 및 성공과 관련된 운
  { value: '이사운', label: '이사운' },  // 이사 및 이동과 관련된 운
  { value: '주��운', label: '주거운' },  // 주택이나 거주지와 관련된 운
  { value: '성격과 성향', label: '성격과 성향' },  // 개인의 성격과 성향 분석
  { value: '균형과 조화', label: '균형과 조화' },  // 오행의 균형과 조화를 통한 인생의 흐름
  { value: '부모운', label: '부모운' },  // 부모님과의 관계에 대한 운
  { value: '형제운', label: '형제운' },  // 형제자매와의 관계에 대한 운
  { value: '사회적 명성', label: '사회적 명성' },  // 사회적 명성, 대인관계와 관련된 운
  { value: '타고난 재능', label: '타고난 재능' },  // 타고난 재능과 능력 분석
];

interface FortuneSection {
  title: string
  content: string
}

export default function Home() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isLunar, setIsLunar] = useState(false);
  const [gender, setGender] = useState<'남' | '여'>('남');
  const [birthTime, setBirthTime] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [fortune, setFortune] = useState<FortuneSection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDateInput, setBirthDateInput] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const basicUrl = process.env.NODE_ENV === 'production' ? 'https://sajutell.ludgi.ai' : 'http://localhost:3000'

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    setBirthDate(date || null);
    if (date) {
      setBirthDateInput(format(date, 'yyyyMMdd'));
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setBirthDateInput(input);
    if (input.length === 8) {
      const parsedDate = parse(input, 'yyyyMMdd', new Date());
      if (!isNaN(parsedDate.getTime())) {
        setBirthDate(parsedDate);
      }
    }
  };

  const MobileDatePicker = () => {
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded-lg">
          <div className="flex space-x-4">
            <select
              value={birthDate?.getFullYear()}
              onChange={(e) => handleDateChange(new Date(parseInt(e.target.value), birthDate?.getMonth() || 0, birthDate?.getDate() || 1))}
              className="bg-gray-700 text-white text-xl p-2 rounded"
            >
              {years.map(year => <option key={year} value={year}>{year}년</option>)}
            </select>
            <select
              value={(birthDate?.getMonth() || 0) + 1}
              onChange={(e) => handleDateChange(new Date(birthDate?.getFullYear() || new Date().getFullYear(), parseInt(e.target.value) - 1, birthDate?.getDate() || 1))}
              className="bg-gray-700 text-white text-xl p-2 rounded"
            >
              {months.map(month => <option key={month} value={month}>{month}월</option>)}
            </select>
            <select
              value={birthDate?.getDate()}
              onChange={(e) => handleDateChange(new Date(birthDate?.getFullYear() || new Date().getFullYear(), birthDate?.getMonth() || 0, parseInt(e.target.value)))}
              className="bg-gray-700 text-white text-xl p-2 rounded"
            >
              {days.map(day => <option key={day} value={day}>{day}일</option>)}
            </select>
          </div>
          <button
            onClick={() => setShowDatePicker(false)}
            className="mt-4 w-full bg-yellow-500 text-gray-900 p-2 rounded text-lg font-bold"
          >
            확인
          </button>
        </div>
      </div>
    );
  };

  const TimePickerModal = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded-lg">
          <div className="flex space-x-4">
            <select
              value={birthTime.split(':')[0]}
              onChange={(e) => setBirthTime(`${e.target.value}:${birthTime?.split(':')[1] ?? '00'}`)}
              className="bg-gray-700 text-white text-xl p-2 rounded"
            >
              {hours.map(hour => <option key={hour} value={hour}>{hour}시</option>)}
            </select>
            <select
              value={birthTime.split(':')[1]}
              onChange={(e) => setBirthTime(`${birthTime.split(':')[0]}:${e.target.value}`)}
              className="bg-gray-700 text-white text-xl p-2 rounded"
            >
              {minutes.map(minute => <option key={minute} value={minute}>{minute}분</option>)}
            </select>
          </div>
          <button
            onClick={() => setShowTimePicker(false)}
            className="mt-4 w-full bg-yellow-500 text-gray-900 p-2 rounded text-lg font-bold"
          >
            확인
          </button>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${basicUrl}/fortune`, {
        name,
        birthDate: birthDate?.toISOString().split('T')[0],
        isLunar,
        gender,
        birthTime,
        interests
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setFortune(response.data.fortune);
    } catch (error) {
      console.error('운세 가져오기 오류:', error);
      if (axios.isAxiosError(error)) {
        alert('운세 가져오기를 실패했습니다. 페이지를 리로드 합니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 페이지를 리로드 합니다.');
      }
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  const handleInterestsChange = (value: string[]) => {
    if (value.length <= 5) {
      setInterests(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="px-8 py-10">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-4xl font-bold text-center text-yellow-500 mb-10"
          >
            사주로 보는 나의 운명
          </motion.h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div variants={fadeInUp}>
              <label htmlFor="name" className="block text-lg font-medium text-gray-300">이름</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white text-lg transition-all duration-300 hover:bg-gray-600"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label htmlFor="birthDate" className="block text-lg font-medium text-gray-300">생년월일</label>
              {isMobile ? (
                <input
                  type="text"
                  id="birthDate"
                  value={birthDateInput}
                  onClick={() => setShowDatePicker(true)}
                  readOnly
                  inputMode="none"
                  placeholder="생년월일 선택"
                  className="mt-2 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white text-lg"
                />
              ) : (
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate ? format(birthDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => handleDateChange(e.target.valueAsDate || undefined)}
                  className="mt-2 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white text-lg"
                />
              )}
              {isMobile && showDatePicker && <MobileDatePicker />}
              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  id="isLunar"
                  checked={isLunar}
                  onChange={(e) => setIsLunar(e.target.checked)}
                  className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-600 rounded"
                />
                <label htmlFor="isLunar" className="ml-3 block text-lg text-gray-300">음력</label>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label htmlFor="gender" className="block text-lg font-medium text-gray-300">성별</label>
              <Select
                id="gender"
                value={gender}
                onChange={(value) => setGender(value)}
                className="mt-2 block w-full text-lg"
                style={{ backgroundColor: '#374151', color: 'white' }}
              >
                <Option value="남">남</Option>
                <Option value="여">여</Option>
              </Select>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label htmlFor="birthTime" className="block text-lg font-medium text-gray-300">태어난 시간 (선택사항)</label>
              <input
                type="text"
                id="birthTime"
                value={birthTime}
                onClick={() => setShowTimePicker(true)}
                readOnly
                placeholder="시간 선택"
                className="mt-2 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white text-lg cursor-pointer"
              />
              {showTimePicker && <TimePickerModal />}
              <p className="mt-2 text-base text-gray-400">모르는 경우 비워두세요</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label htmlFor="interests" className="block text-lg font-medium text-gray-300">관심 분야</label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="관심 분야를 선택하세요 (최대 5개)"
                onChange={handleInterestsChange}
                value={interests}
                optionLabelProp="label"
                className="mt-2 text-lg"
                maxTagCount={5}
              >
                {interestOptions.map((option) => (
                  <Option key={option.value} value={option.value} label={option.label}>
                    <Tag color="gold">{option.label}</Tag>
                  </Option>
                ))}
              </Select>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className='mr-2'
                  >
                    <FaSpinner className="" />
                  </motion.div>
                ) : null}

                {loading ? '운세 분석 중...' : '운세 보기'}
              </button>
            </motion.div>
          </form>
        </div>
        <AnimatePresence>
          {fortune && (
            <motion.div
              key="fortune"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="px-8 py-10 bg-gray-700"
            >
              <motion.h2
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                className="text-2xl font-semibold text-yellow-500 mb-6"
              >
                운세 결과:
              </motion.h2>
              {fortune.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-medium text-yellow-400 mb-2">{section.title}</h3>
                  <p className="text-gray-200 leading-relaxed text-lg">{section.content}</p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-gray-600 rounded-lg text-center"
              >
                <p className="text-yellow-300 text-lg font-medium">
                  여러분의 지원이 더 나은 서비스로 이어집니다!
                </p>
                <p className="text-gray-300 mt-2">
                  광고를 클릭해 주시면 저희에게 큰 힘이 됩니다.
                  여러분의 작은 관심이 더 정확한 운세와 새로운 기능 개발의 원동력이 됩니다.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}