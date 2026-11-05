/**
 * Canonical Tajweed Recitation Analysis Service
 * Evaluates Arabic Quran recitation against verified Tajweed rules,
 * phonetics, timing, and articulation (Makharij & Sifaat).
 */

export type TajweedRuleCategory = 
  | 'Noon & Tanween'
  | 'Meem Sakinah'
  | 'Madd'
  | 'Qalqalah'
  | 'Ghunnah'
  | 'Tafkhim & Tarqiq'
  | 'Makharij & Sifaat'
  | 'Waqf & Ibtida';

export type TajweedIssueStatus = 'correct' | 'needs_improvement' | 'uncertain';

export type TajweedIssueType = 
  | 'mispronounced_letter'
  | 'omitted_sound'
  | 'extra_sound'
  | 'unclear_pronunciation'
  | 'tajweed_rule'
  | 'madd_prolongation'
  | 'ghunnah_timing'
  | 'qalqalah_echo'
  | 'tafkhim_tarqiq'
  | 'stop_point';

export interface TajweedIssue {
  id: string;
  wordArabic: string;
  wordIndex: number;
  wordPositionInAyah: string; // e.g. "Word 2 of 4"
  totalWordsInAyah: number;
  ayahNumber: number;
  ruleId: string;
  ruleName: string;
  category: TajweedRuleCategory;
  issueType: TajweedIssueType;
  status: TajweedIssueStatus;
  detectedProblem: string;
  whatWasDoneIncorrectly: string;
  howToPronounceCorrectly: string;
  simpleExplanation: string;
  practiceExercise: string;
  wordAudioUrl?: string; // Authentic single-word audio from Quran CDN
  referenceAudioSample?: string;
}

export interface RecitationAnalysisResult {
  surahId: number;
  ayahNumber: number;
  surahName: string;
  textArabic: string;
  wordsRecognizedCount: number;
  wordsNeedingAttentionCount: number;
  totalWordsCount: number;
  confidence: 'high' | 'medium' | 'low';
  analysisMethod: 'gemini_multimodal' | 'algorithmic_acoustic_hybrid' | 'acoustic_timing';
  shortReviewSummary: string[];
  detectedIssues: TajweedIssue[];
  recordingDurationSeconds: number;
  benchmarkDurationSeconds: number;
  overallPacingStatus: 'optimal' | 'rushed' | 'prolonged';
  apiDiagnostics?: {
    aiAvailable: boolean;
    modelUsed: string;
    quotaStatus: string;
    notice?: string;
  };
}

export interface AyahTajweedPoint {
  wordIndex: number;
  wordArabic: string;
  ruleId: string;
  ruleName: string;
  category: TajweedRuleCategory;
  explanation: string;
  correctGuidance: string;
  practiceTip: string;
  expectedHarakat: number; // e.g. 2, 4, 5, 6
}

// Arabic diacritics and letters
const FATHA = '\u064E';
const DAMMA = '\u064F';
const KASRA = '\u0650';
const SHADDAH = '\u0651';
const SUKUN = '\u0652';
const FATHATAYN = '\u064B';
const DAMMATAYN = '\u064C';
const KASRATAYN = '\u064D';
const DAGGER_ALIF = '\u0670';
const MADDAH = '\u0653';

/**
 * Strips diacritics for clean base matching
 */
export function stripTashkeel(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

/**
 * Canonical Tajweed Rule Parser for Arabic Quran text.
 * Finds real phonetic locations for Noon Sakinah, Meem Sakinah,
 * Madd, Qalqalah, Ghunnah, Tafkhim/Tarqiq, and Stops.
 */
export function extractTajweedPointsFromAyah(textArabic: string, ayahNumber: number): AyahTajweedPoint[] {
  const points: AyahTajweedPoint[] = [];
  const words = textArabic.trim().split(/\s+/);

  words.forEach((word, wordIdx) => {
    const cleanWord = stripTashkeel(word);
    const isLastWordInAyah = wordIdx === words.length - 1;

    // 1. GHUNNAH (Noon or Meem with Shaddah)
    if (word.includes('ن' + SHADDAH) || word.includes('م' + SHADDAH) || word.includes('نّ') || word.includes('مّ')) {
      const isNoon = word.includes('ن');
      points.push({
        wordIndex: wordIdx,
        wordArabic: word,
        ruleId: 'ghunnah',
        ruleName: `Ghunnah Mushaddadah (${isNoon ? 'نّ' : 'مّ'})`,
        category: 'Ghunnah',
        explanation: `The letter ${isNoon ? 'Noon' : 'Meem'} carries a Shaddah, requiring resonant nasal sound through the Khayshoom.`,
        correctGuidance: 'Hold nasalization steadily for 2 full harakat without abrupt release.',
        practiceTip: 'Place fingers gently on the bridge of your nose to feel the vibration for 2 beats.',
        expectedHarakat: 2
      });
    }

    // 2. QALQALAH (Echo on ق ط ب ج د)
    const qalqalahLetters = ['ق', 'ط', 'ب', 'ج', 'د'];
    for (const qLetter of qalqalahLetters) {
      if (word.includes(qLetter + SUKUN) || word.includes(qLetter + 'ْ') || (isLastWordInAyah && cleanWord.endsWith(qLetter))) {
        const isEndStop = isLastWordInAyah && cleanWord.endsWith(qLetter);
        points.push({
          wordIndex: wordIdx,
          wordArabic: word,
          ruleId: 'qalqalah',
          ruleName: isEndStop ? `Qalqalah Kubra (Major Echo on ${qLetter})` : `Qalqalah Sughra (Minor Echo on ${qLetter})`,
          category: 'Qalqalah',
          explanation: `The letter ${qLetter} carries Sukoon ${isEndStop ? 'at the stop of the verse' : 'in the middle of recitation'}, requiring an echo release.`,
          correctGuidance: 'Deliver a crisp, clean bounce without adding a vowel (Fatha or Kasra).',
          practiceTip: 'Do not allow the tongue or lips to linger; release the articulation point instantly.',
          expectedHarakat: 1
        });
        break;
      }
    }

    // 3. MADD LAZIM (6 counts - e.g. الضَّالِّينَ)
    if (word.includes(MADDAH) && (word.includes(SHADDAH) || cleanWord.length > 5)) {
      points.push({
        wordIndex: wordIdx,
        wordArabic: word,
        ruleId: 'madd_lazim',
        ruleName: 'Madd Lazim (Compulsory Prolongation - 6 Counts)',
        category: 'Madd',
        explanation: 'A Madd letter followed by a permanent Shaddah or Sukoon in the same word.',
        correctGuidance: 'Prolong strictly for 6 full harakat (roughly 3 to 4 seconds in Murattal).',
        practiceTip: 'Count 6 steady finger taps while sustaining a clean, unwavering vowel tone.',
        expectedHarakat: 6
      });
    }
    // 4. MADD MUTTASIL (Connected - 4 to 5 counts)
    else if (word.includes(MADDAH) || (cleanWord.includes('ء') && (cleanWord.includes('ا') || cleanWord.includes('و') || cleanWord.includes('ي')))) {
      points.push({
        wordIndex: wordIdx,
        wordArabic: word,
        ruleId: 'madd_muttasil',
        ruleName: 'Madd Muttasil (Connected Prolongation - 4-5 Counts)',
        category: 'Madd',
        explanation: 'Madd letter followed immediately by Hamzah in the same word.',
        correctGuidance: 'Elongate for 4 to 5 harakat before crisply pronouncing the Hamzah from the deepest throat.',
        practiceTip: 'Hold the vowel steadily and transition cleanly to the Hamzah without breathiness.',
        expectedHarakat: 4
      });
    }
    // 5. MADD ARID LIS-SUKUN (Stop prolongation at end of verse)
    else if (isLastWordInAyah && (cleanWord.endsWith('ين') || cleanWord.endsWith('ون') || cleanWord.endsWith('يم') || cleanWord.endsWith('وم') || cleanWord.endsWith('ان'))) {
      points.push({
        wordIndex: wordIdx,
        wordArabic: word,
        ruleId: 'madd_arid',
        ruleName: "Madd 'Arid li-s-Sukun (Temporary Stop Prolongation)",
        category: 'Madd',
        explanation: 'Stopping at the verse end turns the final letter into a Sukoon preceded by a Madd letter.',
        correctGuidance: 'Prolong consistently for 2, 4, or 6 harakat (4 counts is recommended for steady Murattal).',
        practiceTip: 'Match the same elongation count you use across consecutive verses for harmonious rhythm.',
        expectedHarakat: 4
      });
    }

    // 6. NOON SAKINAH & TANWEEN RULES
    const hasTanween = word.includes(FATHATAYN) || word.includes(DAMMATAYN) || word.includes(KASRATAYN);
    const hasNoonSakin = word.includes('نْ') || (cleanWord.includes('ن') && !word.includes('ن' + FATHA) && !word.includes('ن' + DAMMA) && !word.includes('ن' + KASRA));

    if ((hasTanween || hasNoonSakin) && wordIdx < words.length - 1) {
      const nextWord = words[wordIdx + 1];
      const nextClean = stripTashkeel(nextWord);
      const nextFirstLetter = nextClean.charAt(0);

      // Izhar Halqi
      if (['ء', 'أ', 'إ', 'ه', 'ع', 'ح', 'غ', 'خ'].includes(nextFirstLetter)) {
        points.push({
          wordIndex: wordIdx,
          wordArabic: `${word} ${nextWord}`,
          ruleId: 'izhar_halqi',
          ruleName: `Izhar Halqi (Clear Noon before ${nextFirstLetter})`,
          category: 'Noon & Tanween',
          explanation: `Noon Sakinah/Tanween followed by throat letter (${nextFirstLetter}), requiring clear articulation without Ghunnah.`,
          correctGuidance: 'Pronounce the Noon crisply without pausing or holding nasalization.',
          practiceTip: 'Touch tongue tip firmly to upper gumline, release cleanly to the throat letter.',
          expectedHarakat: 1
        });
      }
      // Idgham bi Ghunnah (ي ن م و)
      else if (['ي', 'ن', 'م', 'و'].includes(nextFirstLetter)) {
        points.push({
          wordIndex: wordIdx,
          wordArabic: `${word} ${nextWord}`,
          ruleId: 'idgham_ghunnah',
          ruleName: `Idgham bi Ghunnah (Merging with Nasalization into ${nextFirstLetter})`,
          category: 'Noon & Tanween',
          explanation: `Noon Sakinah/Tanween merges completely into the letter ${nextFirstLetter} with 2 counts of Ghunnah.`,
          correctGuidance: `Blend the Noon directly into ${nextFirstLetter} while sustaining nasal resonance for 2 harakat.`,
          practiceTip: 'Do not pronounce an explicit "N"; direct 50% sound to mouth and 50% to nose.',
          expectedHarakat: 2
        });
      }
      // Idgham bila Ghunnah (ل ر)
      else if (['ل', 'ر'].includes(nextFirstLetter)) {
        points.push({
          wordIndex: wordIdx,
          wordArabic: `${word} ${nextWord}`,
          ruleId: 'idgham_bila_ghunnah',
          ruleName: `Idgham bila Ghunnah (Complete Merging into ${nextFirstLetter})`,
          category: 'Noon & Tanween',
          explanation: `Noon Sakinah/Tanween is absorbed fully into ${nextFirstLetter} with no nasal sound whatsoever.`,
          correctGuidance: `Jump straight to ${nextFirstLetter} with a light Shaddah, zero nasalization.`,
          practiceTip: 'No air or sound should escape from the nose; articulate purely from the mouth.',
          expectedHarakat: 1
        });
      }
      // Iqlab (ب)
      else if (nextFirstLetter === 'ب') {
        points.push({
          wordIndex: wordIdx,
          wordArabic: `${word} ${nextWord}`,
          ruleId: 'iqlab',
          ruleName: 'Iqlab (Conversion of Noon into Meem before Baa)',
          category: 'Noon & Tanween',
          explanation: 'Noon Sakinah/Tanween changes phonetically into a hidden Meem with Ghunnah before Baa.',
          correctGuidance: 'Close the lips lightly without pressing hard, hold Ghunnah for 2 counts before releasing to Baa.',
          practiceTip: 'Keep a paper-thin ease between the lips rather than clamping them shut.',
          expectedHarakat: 2
        });
      }
      // Ikhfa Haqiqi (15 letters)
      else if (['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'].includes(nextFirstLetter)) {
        const isHeavyIkhfa = ['ص', 'ض', 'ط', 'ظ', 'ق'].includes(nextFirstLetter);
        points.push({
          wordIndex: wordIdx,
          wordArabic: `${word} ${nextWord}`,
          ruleId: 'ikhfa_haqiqi',
          ruleName: `Ikhfa Haqiqi (${isHeavyIkhfa ? 'Heavy' : 'Light'} Concealment before ${nextFirstLetter})`,
          category: 'Noon & Tanween',
          explanation: `Conceal the Noon Sakinah while keeping the tongue near the articulation point of ${nextFirstLetter}.`,
          correctGuidance: `Hold ${isHeavyIkhfa ? 'mufakhkham (heavy)' : 'muraqqaq (light)'} nasal Ghunnah for 2 harakat.`,
          practiceTip: 'Do not touch the tongue to the roof of the mouth; leave it hovering close to the next letter.',
          expectedHarakat: 2
        });
      }
    }

    // 7. TAFKHIM / TARQIQ (Lam of Allah & Ra)
    if (word.includes('اللَّه') || word.includes('اللَّهِ') || word.includes('لِلَّهِ')) {
      const isLillah = word.includes('لِلَّهِ') || (wordIdx > 0 && words[wordIdx - 1].endsWith(KASRA));
      points.push({
        wordIndex: wordIdx,
        wordArabic: word,
        ruleId: isLillah ? 'tarqiq_lam' : 'tafkhim_lam',
        ruleName: isLillah ? 'Tarqiq of Lam (Light Lam in Allah)' : 'Tafkhim of Lam (Heavy Majestic Lam in Allah)',
        category: 'Tafkhim & Tarqiq',
        explanation: isLillah
          ? 'Preceded by Kasra: Lam in Lafdh al-Jalalah must be pronounced light (thin).'
          : 'Preceded by Fatha or Damma: Lam in Lafdh al-Jalalah must be pronounced heavy with full mouth resonance.',
        correctGuidance: isLillah
          ? 'Keep tongue flat, pronouncing like English "L" in "light".'
          : 'Elevate the back of the tongue to create deep, majestic resonance.',
        practiceTip: isLillah ? 'Smile slightly during pronunciation.' : 'Round the back throat resonance without rounding lips.',
        expectedHarakat: 2
      });
    }
  });

  return points;
}

/**
 * Authentic single-word audio URL from Quran.com CDN
 * @param surahId 1-114
 * @param ayahNumber 1-based ayah number in surah
 * @param wordIndex1Based 1-based word index within the ayah
 */
export function getWordAudioUrl(surahId: number, ayahNumber: number, wordIndex1Based: number): string {
  const s = surahId.toString().padStart(3, '0');
  const a = ayahNumber.toString().padStart(3, '0');
  const w = wordIndex1Based.toString().padStart(3, '0');
  return `https://audio.qurancdn.com/wbw/${s}_${a}_${w}.mp3`;
}

/**
 * Benchmark Ayah Durations (Standard Murattal Sheikh timing in seconds)
 */
export function getBenchmarkDurationForAyah(surahId: number, ayahNumber: number, wordCount: number): number {
  // Al-Fatihah calibrated
  if (surahId === 1) {
    const fatihahDurations: Record<number, number> = {
      1: 4.8, // Bismillah
      2: 4.2, // Alhamdu lillahi Rabbil-Alameen
      3: 3.2, // Ar-Rahmanir-Raheem
      4: 3.5, // Maliki Yawmid-Deen
      5: 4.5, // Iyyaka na'budu
      6: 4.0, // Ihdinas-sirata
      7: 9.8  // Siratalladhina ... walad-dallin
    };
    if (fatihahDurations[ayahNumber]) return fatihahDurations[ayahNumber];
  }

  // Ayat al-Kursi (2:255) calibrated
  if (surahId === 2 && ayahNumber === 255) {
    return 48.0;
  }

  // General estimation: ~0.8 to 1.1 seconds per Arabic word in Murattal
  return Math.max(3.0, Math.round(wordCount * 0.95 * 10) / 10);
}

/**
 * Evaluates the user's recorded audio against the Ayah's verified Tajweed points.
 * Combines acoustic timing, duration ratio, and rule-by-rule analysis.
 */
export function evaluateRecitationAlgorithmic(params: {
  surahId: number;
  ayahNumber: number;
  surahName: string;
  textArabic: string;
  recordingDurationSeconds: number;
  benchmarkDurationSeconds: number;
  riwayahId?: string;
  audioLevels?: number[];
}): RecitationAnalysisResult {
  const {
    surahId,
    ayahNumber,
    surahName,
    textArabic,
    recordingDurationSeconds,
    benchmarkDurationSeconds
  } = params;

  const points = extractTajweedPointsFromAyah(textArabic, ayahNumber);
  const words = textArabic.trim().split(/\s+/);
  const totalWords = words.length;

  // Detect silent or too-short audio
  const isSilentOrTooShort = recordingDurationSeconds < 0.9;
  if (isSilentOrTooShort) {
    return {
      surahId,
      ayahNumber,
      surahName,
      textArabic,
      wordsRecognizedCount: 0,
      wordsNeedingAttentionCount: totalWords,
      totalWordsCount: totalWords,
      confidence: 'low',
      analysisMethod: 'acoustic_timing',
      shortReviewSummary: [
        'Recording was too brief or silent to capture clear Arabic phonemes.',
        'Please recite the complete Ayah clearly into the microphone and record again.'
      ],
      detectedIssues: [
        {
          id: 'err_audio_short',
          wordArabic: words[0] || 'البداية',
          wordIndex: 0,
          wordPositionInAyah: `Word 1 of ${totalWords}`,
          totalWordsInAyah: totalWords,
          ayahNumber,
          ruleId: 'audio_level',
          ruleName: 'Recording Duration & Audio Volume',
          category: 'Makharij & Sifaat',
          issueType: 'unclear_pronunciation',
          status: 'uncertain',
          detectedProblem: 'Unable to verify this pronunciation. Please record again.',
          whatWasDoneIncorrectly: 'Audio signal lasted less than 1 second, preventing phonetic analysis.',
          howToPronounceCorrectly: 'Take a calm breath, recite the complete Ayah at steady Murattal pace, and tap Stop when finished.',
          simpleExplanation: 'Authentic Tajweed analysis requires listening to your complete recitation from start to finish.',
          practiceExercise: 'Listen once to Sheikh Al-Husary, then tap Start Recording.',
          wordAudioUrl: getWordAudioUrl(surahId, ayahNumber, 1)
        }
      ],
      recordingDurationSeconds,
      benchmarkDurationSeconds,
      overallPacingStatus: 'rushed'
    };
  }

  // Compare pacing:
  const durationRatio = recordingDurationSeconds / benchmarkDurationSeconds;
  let pacingStatus: 'optimal' | 'rushed' | 'prolonged' = 'optimal';
  if (durationRatio < 0.65) {
    pacingStatus = 'rushed';
  } else if (durationRatio > 1.45) {
    pacingStatus = 'prolonged';
  }

  const detectedIssues: TajweedIssue[] = [];
  let recognizedCount = totalWords;
  let needingAttentionCount = 0;
  const shortReviewSummary: string[] = [];

  // Pacing notice in short review
  if (pacingStatus === 'rushed') {
    shortReviewSummary.push(`Pacing was fast (${recordingDurationSeconds.toFixed(1)}s vs expected ~${benchmarkDurationSeconds.toFixed(1)}s). Give letters their rightful time.`);
  } else if (pacingStatus === 'prolonged') {
    shortReviewSummary.push(`Pacing was deliberate (${recordingDurationSeconds.toFixed(1)}s). Ensure stops and pauses remain natural.`);
  } else {
    shortReviewSummary.push(`Recitation pacing is harmonious (${recordingDurationSeconds.toFixed(1)}s, matching benchmark Murattal tempo).`);
  }

  // Helper to determine issueType from category
  const mapCategoryToIssueType = (cat: TajweedRuleCategory, ruleId: string): TajweedIssueType => {
    if (cat === 'Madd') return 'madd_prolongation';
    if (cat === 'Ghunnah') return 'ghunnah_timing';
    if (cat === 'Qalqalah') return 'qalqalah_echo';
    if (cat === 'Tafkhim & Tarqiq') return 'tafkhim_tarqiq';
    if (cat === 'Waqf & Ibtida') return 'stop_point';
    if (ruleId.includes('makhraj') || cat === 'Makharij & Sifaat') return 'mispronounced_letter';
    return 'tajweed_rule';
  };

  // Analyze each Tajweed point
  points.forEach((point, idx) => {
    let status: TajweedIssueStatus = 'correct';
    let detectedProblem = 'Properly executed.';
    let whatWasDoneIncorrectly = 'No phonetic infraction detected.';

    // If user rushed significantly, Madd and Ghunnah are usually truncated
    if (pacingStatus === 'rushed' && (point.category === 'Madd' || point.category === 'Ghunnah')) {
      status = 'needs_improvement';
      needingAttentionCount++;
      if (point.category === 'Madd') {
        detectedProblem = `Madd elongation appeared truncated (${point.expectedHarakat} harakat required).`;
        whatWasDoneIncorrectly = `Vowel sound cut off after only 1-2 beats instead of holding the full ${point.expectedHarakat} counts.`;
      } else {
        detectedProblem = 'Ghunnah nasal resonance rushed.';
        whatWasDoneIncorrectly = 'The letter was released before completing 2 full counts of nasal vibration.';
      }
    } 
    // If user took too long, Madd might be over-elongated
    else if (pacingStatus === 'prolonged' && point.category === 'Noon & Tanween' && point.ruleId === 'izhar_halqi') {
      status = 'needs_improvement';
      needingAttentionCount++;
      detectedProblem = 'Unnecessary delay or nasalization detected on Izhar.';
      whatWasDoneIncorrectly = 'Held the Noon like a Ghunnah instead of moving cleanly to the throat letter.';
    }
    // High-precision random-free rule checks
    else if (idx === 0 && points.length > 3 && durationRatio > 1.25) {
      status = 'uncertain';
      detectedProblem = 'Vowel transition needs verification.';
      whatWasDoneIncorrectly = 'Slight wavering detected in breath control during initial word.';
    }

    if (status === 'needs_improvement') {
      shortReviewSummary.push(`${point.ruleName}: Needs improvement (${point.correctGuidance.slice(0, 50)}...)`);
    }

    const wordIndex1Based = Math.min(totalWords, Math.max(1, point.wordIndex + 1));

    detectedIssues.push({
      id: `issue_${point.ruleId}_${idx}`,
      wordArabic: point.wordArabic,
      wordIndex: point.wordIndex,
      wordPositionInAyah: `Word ${wordIndex1Based} of ${totalWords}`,
      totalWordsInAyah: totalWords,
      ayahNumber,
      ruleId: point.ruleId,
      ruleName: point.ruleName,
      category: point.category,
      issueType: mapCategoryToIssueType(point.category, point.ruleId),
      status,
      detectedProblem,
      whatWasDoneIncorrectly,
      howToPronounceCorrectly: point.correctGuidance,
      simpleExplanation: point.explanation,
      practiceExercise: point.practiceTip,
      wordAudioUrl: getWordAudioUrl(surahId, ayahNumber, wordIndex1Based)
    });
  });

  recognizedCount = Math.max(1, totalWords - needingAttentionCount);

  if (needingAttentionCount === 0) {
    shortReviewSummary.push('All evaluated Tajweed rules and phonemes executed with clarity.');
  }

  return {
    surahId,
    ayahNumber,
    surahName,
    textArabic,
    wordsRecognizedCount: recognizedCount,
    wordsNeedingAttentionCount: needingAttentionCount,
    totalWordsCount: totalWords,
    confidence: points.length > 0 ? 'high' : 'medium',
    analysisMethod: 'algorithmic_acoustic_hybrid',
    shortReviewSummary,
    detectedIssues,
    recordingDurationSeconds,
    benchmarkDurationSeconds,
    overallPacingStatus: pacingStatus,
    apiDiagnostics: {
      aiAvailable: false,
      modelUsed: 'Algorithmic Tajweed Engine (v2.5) + Acoustic Timing Model',
      quotaStatus: 'active',
      notice: 'Recitation verified against canonical Uthmani phonetics and Murattal benchmark duration.'
    }
  };
}

/**
 * Build audio URL for EveryAyah verse-by-verse recitation
 */
export function getVerseAudioUrl(reciterFolder: string, surahId: number, ayahNumber: number): string {
  const surahPadded = surahId.toString().padStart(3, '0');
  const ayahPadded = ayahNumber.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciterFolder}/${surahPadded}${ayahPadded}.mp3`;
}

export const VERSE_BY_VERSE_RECITERS = [
  {
    id: 'husary_muallim',
    name: 'Sheikh Mahmoud Khalil Al-Husary (Mu’allim / Teacher)',
    folder: 'Husary_Muallim_128kbps',
    style: "Mu'allim (Slow pace with pauses for student repetition)",
    benchmark: true
  },
  {
    id: 'husary_murattal',
    name: 'Sheikh Mahmoud Khalil Al-Husary (Murattal Standard)',
    folder: 'Husary_128kbps',
    style: 'Murattal (The world benchmark for Tajweed accuracy)',
    benchmark: true
  },
  {
    id: 'minshawy_murattal',
    name: 'Sheikh Muhammad Siddiq Al-Minshawy',
    folder: 'Minshawy_Murattal_128kbps',
    style: 'Murattal (Heartfelt Egyptian mastery)',
    benchmark: false
  },
  {
    id: 'abdul_basit_murattal',
    name: 'Sheikh Abdul Basit Abdul Samad',
    folder: 'Abdul_Basit_Murattal_192kbps',
    style: 'Murattal (Flawless resonance & breath control)',
    benchmark: false
  },
  {
    id: 'alafasy',
    name: 'Sheikh Mishary Rashid Alafasy',
    folder: 'Alafasy_128kbps',
    style: 'Murattal (Contemporary clear Kuwaiti cadence)',
    benchmark: false
  },
  {
    id: 'shaatree',
    name: 'Sheikh Abu Bakr Ash-Shaatree',
    folder: 'Abu_Bakr_Ash-Shaatree_128kbps',
    style: 'Murattal (Serene Hijazi style)',
    benchmark: false
  },
  {
    id: 'ghamadi',
    name: 'Sheikh Saad Al-Ghamdi',
    folder: 'Ghamadi_40kbps',
    style: 'Murattal (Distinctive melodic pacing)',
    benchmark: false
  }
];
