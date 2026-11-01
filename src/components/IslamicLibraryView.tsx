import React, { useState, useMemo } from 'react';
import { 
  BookMarked, 
  Search, 
  Filter, 
  ArrowLeft, 
  BookOpen, 
  Heart, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  ShieldCheck, 
  User, 
  Layers, 
  Clock, 
  FileText, 
  Info,
  Type,
  Sun,
  Moon,
  ExternalLink,
  Plus
} from 'lucide-react';
import { 
  LibraryBook, 
  LibraryCategory, 
  ISLAMIC_BOOKS, 
  LIBRARY_CATEGORIES, 
  getBooksByCategory, 
  searchBooks, 
  getBookById 
} from '../data/islamicLibrary';
import { HisnulMuslimExperience } from './HisnulMuslimExperience';

export const IslamicLibraryView: React.FC = () => {
  // Primary mode: 'library' | 'hisnul_muslim'
  const [libraryMode, setLibraryMode] = useState<'library' | 'hisnul_muslim'>('library');

  // Navigation states: 'home' (categories overview) | 'category' (all books in category) | 'book' (book details & reader)
  const [activeView, setActiveView] = useState<'home' | 'category' | 'book'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<LibraryCategory['id']>('hadith');
  const [selectedBookId, setSelectedBookId] = useState<string>('bukhari');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Reader state
  const [readerFontSize, setReaderFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [readerTheme, setReaderTheme] = useState<'cream' | 'sepia' | 'dark' | 'white'>('cream');
  const [readerLanguage, setReaderLanguage] = useState<'all' | 'arabic' | 'english' | 'hausa'>('all');
  const [passageSearch, setPassageSearch] = useState<string>('');

  // Adhkar Counters: Map of passageId -> current count
  const [adhkarCounters, setAdhkarCounters] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_adhkar_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Favorites & Bookmarks persistence
  const [favoriteBookIds, setFavoriteBookIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_favorite_books');
      return saved ? JSON.parse(saved) : ['bukhari', 'hisnul-muslim', 'riyad-salihin'];
    } catch {
      return ['bukhari', 'hisnul-muslim', 'riyad-salihin'];
    }
  });

  const [bookmarkedPassageIds, setBookmarkedPassageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_bookmarked_passages');
      return saved ? JSON.parse(saved) : ['bukhari-1', 'hisn-1'];
    } catch {
      return ['bukhari-1', 'hisn-1'];
    }
  });

  const [copiedPassageId, setCopiedPassageId] = useState<string | null>(null);

  // Active book
  const activeBook = useMemo(() => {
    return getBookById(selectedBookId) || ISLAMIC_BOOKS[0];
  }, [selectedBookId]);

  // Active category
  const activeCategory = useMemo(() => {
    return LIBRARY_CATEGORIES.find(c => c.id === selectedCategoryId) || LIBRARY_CATEGORIES[0];
  }, [selectedCategoryId]);

  // Books in active category
  const booksInCategory = useMemo(() => {
    return getBooksByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  // Global search results
  const searchResults = useMemo(() => {
    return searchBooks(searchQuery);
  }, [searchQuery]);

  // Favorite books list
  const favoriteBooks = useMemo(() => {
    return ISLAMIC_BOOKS.filter(b => favoriteBookIds.includes(b.id));
  }, [favoriteBookIds]);

  const toggleFavorite = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let next: string[];
    if (favoriteBookIds.includes(bookId)) {
      next = favoriteBookIds.filter(id => id !== bookId);
    } else {
      next = [...favoriteBookIds, bookId];
    }
    setFavoriteBookIds(next);
    localStorage.setItem('nur_quran_favorite_books', JSON.stringify(next));
  };

  const togglePassageBookmark = (passageId: string) => {
    let next: string[];
    if (bookmarkedPassageIds.includes(passageId)) {
      next = bookmarkedPassageIds.filter(id => id !== passageId);
    } else {
      next = [...bookmarkedPassageIds, passageId];
    }
    setBookmarkedPassageIds(next);
    localStorage.setItem('nur_quran_bookmarked_passages', JSON.stringify(next));
  };

  const handleCopyPassage = (p: LibraryBook['samplePassages'][0]) => {
    const text = `${p.arabicText}\n\n${p.englishTranslation}${p.hausaTranslation ? `\n\nHausa: ${p.hausaTranslation}` : ''}\n\n— [${activeBook.title}, ${p.reference}]`;
    navigator.clipboard.writeText(text);
    setCopiedPassageId(p.id);
    setTimeout(() => setCopiedPassageId(null), 2000);
  };

  const handleIncrementAdhkar = (passageId: string, targetCount: number = 3) => {
    const current = adhkarCounters[passageId] || 0;
    const next = current + 1;
    const updated = { ...adhkarCounters, [passageId]: next };
    setAdhkarCounters(updated);
    localStorage.setItem('nur_quran_adhkar_counts', JSON.stringify(updated));
  };

  const handleResetAdhkar = (passageId: string) => {
    const updated = { ...adhkarCounters, [passageId]: 0 };
    setAdhkarCounters(updated);
    localStorage.setItem('nur_quran_adhkar_counts', JSON.stringify(updated));
  };

  const openCategory = (catId: LibraryCategory['id']) => {
    setSelectedCategoryId(catId);
    setActiveView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBook = (bookId: string) => {
    if (bookId === 'hisnul-muslim') {
      setLibraryMode('hisnul_muslim');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSelectedBookId(bookId);
    setActiveView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reader theme class helper
  const getReaderThemeClasses = () => {
    switch (readerTheme) {
      case 'cream':
        return 'bg-[#FBF8EE] text-[#1C1917] border-[#D4C3A3]';
      case 'sepia':
        return 'bg-[#F4EEDD] text-[#292524] border-[#C8B896]';
      case 'dark':
        return 'bg-[#181B1E] text-[#E6E1D3] border-[#363B42]';
      case 'white':
        return 'bg-white text-slate-900 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Primary Experience Mode Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setLibraryMode('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              libraryMode === 'library'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Complete Library (60 Collections)</span>
          </button>

          <button
            onClick={() => setLibraryMode('hisnul_muslim')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              libraryMode === 'hisnul_muslim'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Hisnul Muslim Experience (10 Sections)</span>
          </button>
        </div>

        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-3 hidden sm:block">
          {libraryMode === 'hisnul_muslim' ? 'حصن المسلم · 10 Sections with Repetition Counters' : 'Hadith, Adhkar, Aqidah, Seerah, Fiqh & Quran Studies'}
        </div>
      </div>

      {libraryMode === 'hisnul_muslim' ? (
        <HisnulMuslimExperience />
      ) : (
        <>
          {/* ── View 1: Library Home (Categories Overview & Favorites) ── */}
          {activeView === 'home' && (
            <div className="space-y-8 animate-fade-in">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border border-emerald-700/40">
            <div className="absolute -right-8 -bottom-8 opacity-10 font-arabic text-9xl pointer-events-none select-none">
              مكتبة
            </div>

            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-amber-300 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Maktabah Nur Al-Quran · Islamic Library</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Authentic Islamic Book Library
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Explore canonical Hadith compilations, daily prophetic Adhkar with interactive counters, foundational works on Tawhid, Seerah, Fiqh of worship, and Quranic sciences.
              </p>
            </div>

            {/* Global Book Search Bar */}
            <div className="mt-6 max-w-xl relative z-10">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, authors, topics (e.g. Bukhari, Hisnul Muslim, Tawhid)..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* If Search is Active: Display Search Results */}
          {searchQuery ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Search Results for "{searchQuery}" ({searchResults.length} books found)
                </h2>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  Show all categories
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => openBook(book.id)}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          {book.categoryLabel}
                        </span>
                        <button
                          onClick={(e) => toggleFavorite(book.id, e)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <Heart className={`w-4 h-4 ${favoriteBookIds.includes(book.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {book.title}
                      </h3>
                      <div className="font-arabic text-xs text-slate-400">
                        {book.arabicTitle}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {book.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{book.author.split('(')[0].trim()}</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        Read Book <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Featured: Dedicated Hisnul Muslim Experience Spotlight Banner */}
              <div 
                onClick={() => setLibraryMode('hisnul_muslim')}
                className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 hover:from-emerald-700 hover:to-teal-700 text-white p-4 sm:p-5 rounded-3xl border border-emerald-600/40 shadow-sm cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-amber-300 border border-emerald-500/30">
                        DAILY FORTRESS
                      </span>
                      <span className="text-xs text-emerald-200">10 Organized Sections · Counters</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors">
                      Hisnul Muslim (Fortress of the Muslim)
                    </h3>
                    <p className="text-xs text-emerald-100/80 line-clamp-1">
                      Morning & evening Adhkar, post-prayer adhkar, and protection with Arabic, transliteration, English, Hausa meanings, and interactive tap counters.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform self-end sm:self-center bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <span>Open 10 Sections</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* ── Section: The 6 Dedicated Categories ── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Browse by Category
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Select a specialized section to open its dedicated collection
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LIBRARY_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => openCategory(cat.id)}
                      className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                            <BookMarked className="w-5 h-5" />
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {cat.bookCount} Books
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {cat.title}
                          </h3>
                          <div className="font-arabic text-xs text-slate-400 mt-0.5">
                            {cat.arabicTitle}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {cat.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                        <span>Open Category</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Section: Favorites / Quick Access ── */}
              {favoriteBooks.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Your Favorite & Essential Books
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {favoriteBooks.map(book => (
                      <div
                        key={book.id}
                        onClick={() => openBook(book.id)}
                        className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="truncate min-w-0 pr-2">
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {book.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {book.categoryLabel}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}

      {/* ── View 2: Category Dedicated Page ── */}
      {activeView === 'category' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Back button & Category Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('home')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                title="Back to All Categories"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {activeCategory.title}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    {booksInCategory.length} Books
                  </span>
                </div>
                <div className="font-arabic text-xs text-slate-400 mt-0.5">
                  {activeCategory.arabicTitle}
                </div>
              </div>
            </div>

            {/* Category Quick Switcher Tabs */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {LIBRARY_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => openCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategoryId === cat.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Books in this category grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {booksInCategory.map((book) => (
              <div
                key={book.id}
                onClick={() => openBook(book.id)}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {book.title}
                      </h3>
                      <div className="font-arabic text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {book.arabicTitle}
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(book.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                    >
                      <Heart className={`w-4 h-4 ${favoriteBookIds.includes(book.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                    <div><strong>Author:</strong> {book.author}</div>
                    <div><strong>Translations:</strong> {book.availableTranslations.join(', ')}</div>
                    {book.hadithCount && (
                      <div><strong>Hadiths:</strong> {book.hadithCount.toLocaleString()} verified traditions</div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Open Full Book & Study Passages</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── View 3: Book Details & Reader Experience ── */}
      {activeView === 'book' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header & Back Button */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('category')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                title="Back to category"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  {activeBook.categoryLabel}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {activeBook.title}
                </h1>
                <div className="font-arabic text-sm text-emerald-600 dark:text-emerald-400">
                  {activeBook.arabicTitle}
                </div>
              </div>
            </div>

            {/* Reading Options toolbar */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              
              {/* Font Size */}
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                <button
                  onClick={() => setReaderFontSize('normal')}
                  className={`px-2 py-1 rounded ${readerFontSize === 'normal' ? 'bg-white dark:bg-slate-700 font-bold' : 'text-slate-500'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setReaderFontSize('large')}
                  className={`px-2 py-1 rounded ${readerFontSize === 'large' ? 'bg-white dark:bg-slate-700 font-bold' : 'text-slate-500'}`}
                >
                  A+
                </button>
                <button
                  onClick={() => setReaderFontSize('xlarge')}
                  className={`px-2 py-1 rounded ${readerFontSize === 'xlarge' ? 'bg-white dark:bg-slate-700 font-bold' : 'text-slate-500'}`}
                >
                  A++
                </button>
              </div>

              {/* Theme */}
              <select
                value={readerTheme}
                onChange={(e) => setReaderTheme(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="cream">Cream</option>
                <option value="sepia">Antique Sepia</option>
                <option value="dark">Nocturnal Dark</option>
                <option value="white">Crisp White</option>
              </select>

              {/* Language display filter */}
              <select
                value={readerLanguage}
                onChange={(e) => setReaderLanguage(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">Arabic + English + Hausa</option>
                <option value="arabic">Arabic Only</option>
                <option value="english">English Only</option>
                <option value="hausa">Hausa Translation</option>
              </select>
            </div>
          </div>

          {/* Book Information Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-medium">Author & Background</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeBook.author}</div>
                <p className="text-[11px] text-slate-500 mt-1">{activeBook.authorBio}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-medium">What the Book Teaches</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeBook.whatItTeaches}</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                  {activeBook.authenticityInfo}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-medium">Key Lessons</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 mt-1 space-y-0.5">
                  {activeBook.keyLessons.map((lesson, idx) => (
                    <li key={idx}>{lesson}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Passages / Chapters Reading Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Verified Passages, Hadiths & Invocations</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({activeBook.samplePassages.length} chapters loaded)
                </span>
              </h2>
            </div>

            {/* Passages List */}
            <div className="space-y-4">
              {activeBook.samplePassages.map((passage) => {
                const isBookmarked = bookmarkedPassageIds.includes(passage.id);
                const isCopied = copiedPassageId === passage.id;
                const targetCount = passage.targetCount || 1;
                const currentCount = adhkarCounters[passage.id] || 0;
                const isAdhkarComplete = currentCount >= targetCount && targetCount > 1;

                return (
                  <div
                    key={passage.id}
                    className={`p-6 rounded-2xl border shadow-sm transition-all ${getReaderThemeClasses()}`}
                  >
                    
                    {/* Passage Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-black/10 dark:border-white/10">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base">
                          {passage.title}
                        </h3>
                        <div className="text-[11px] opacity-75 font-mono">
                          {passage.reference} {passage.grading ? `· Grading: ${passage.grading}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Bookmark Button */}
                        <button
                          onClick={() => togglePassageBookmark(passage.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isBookmarked ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-60'
                          }`}
                          title="Bookmark Passage"
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyPassage(passage)}
                          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100 transition-colors"
                          title="Copy text & reference"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text with Tashkeel */}
                    {(readerLanguage === 'all' || readerLanguage === 'arabic') && (
                      <div 
                        dir="rtl"
                        className={`font-arabic leading-loose text-right my-4 ${
                          readerFontSize === 'xlarge' ? 'text-2xl sm:text-3xl' : readerFontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                        }`}
                      >
                        {passage.arabicText}
                      </div>
                    )}

                    {/* Transliteration (if available, e.g. for Adhkar) */}
                    {passage.transliteration && (readerLanguage === 'all' || readerLanguage === 'english') && (
                      <div className="text-xs italic opacity-80 my-2 bg-black/5 dark:bg-white/5 p-3 rounded-xl font-mono">
                        {passage.transliteration}
                      </div>
                    )}

                    {/* English Translation */}
                    {(readerLanguage === 'all' || readerLanguage === 'english') && (
                      <div className={`leading-relaxed my-2 ${
                        readerFontSize === 'xlarge' ? 'text-base' : readerFontSize === 'large' ? 'text-sm' : 'text-xs sm:text-sm'
                      }`}>
                        {passage.englishTranslation}
                      </div>
                    )}

                    {/* Hausa Translation (Where available) */}
                    {passage.hausaTranslation && (readerLanguage === 'all' || readerLanguage === 'hausa') && (
                      <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                        <strong className="block text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Fassarasar Hausa:
                        </strong>
                        {passage.hausaTranslation}
                      </div>
                    )}

                    {/* Interactive Repetition Counter for Adhkar */}
                    {targetCount > 1 && (
                      <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">
                            Sunnah Recommended Repetition: {targetCount} Times
                          </span>
                          {isAdhkarComplete && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                              ✓ Completed
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleIncrementAdhkar(passage.id, targetCount)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 ${
                              isAdhkarComplete 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            }`}
                          >
                            <span>Count: {currentCount} / {targetCount}</span>
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          {currentCount > 0 && (
                            <button
                              onClick={() => handleResetAdhkar(passage.id)}
                              className="p-1.5 rounded-lg opacity-60 hover:opacity-100"
                              title="Reset Counter"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Benefits / Virtues */}
                    {passage.benefits && (
                      <div className="mt-3 text-[11px] opacity-75 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{passage.benefits}</span>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}
        </>
      )}

    </div>
  );
};
