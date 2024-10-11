'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Select, Tag } from 'antd';
import { FaSpinner } from 'react-icons/fa';

const { Option } = Select;

const interestOptions = [
  { value: '재물운', label: '재물운' },
  { value: '사업운', label: '사업운' },
  { value: '연애운', label: '연애운' },
  { value: '건강운', label: '건강운' },
  { value: '학업운', label: '학업운' },
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
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-4 rounded-lg">
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/fortune', {
        name,
        birthDate: birthDate?.toISOString().split('T')[0],
        isLunar,
        gender,
        birthTime,
        interests
      });
      setFortune(response.data.fortune);
    } catch (error) {
      console.error('운세 가져오기 오류:', error);
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
            고급 사주 운세 보기
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
                type="time"
                id="birthTime"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="mt-2 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white text-lg"
              />
              <p className="mt-2 text-base text-gray-400">모르는 경우 비워두세요</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label htmlFor="interests" className="block text-lg font-medium text-gray-300">관심 분야</label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="관심 분야를 선택하세요"
                onChange={(value) => setInterests(value)}
                optionLabelProp="label"
                className="mt-2 text-lg"
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
                  >
                    <FaSpinner className="mr-2" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}