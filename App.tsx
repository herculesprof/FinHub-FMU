import React, { useMemo, useState, useRef } from 'react';
import { RAW_DATA, GEMINI_INTELLIGENCE } from './constants';
import { EnrichedTransaction } from './types';
import { TransactionCard } from './components/TransactionCard';
import { GoogleGenAI } from "@google/genai";
import { 
  Wallet, 
  PieChart, 
  User, 
  Bell, 
  Search,
  ScanLine,
  ArrowUpCircle,
  ArrowDownCircle,
  Sparkles,
  Loader2,
  X,
  Upload,
  CreditCard,
  Send,
  Smartphone,
  Copy,
  CheckCircle2
} from 'lucide-react';

// URL placeholder para o Lobo FMU Tech (Substitua pela sua imagem real ou Base64)
const DEFAULT_PROFILE_IMAGE = "https://cdn3d.iconscout.com/3d/premium/thumb/wolf-avatar-6299534-5187866.png?f=webp";

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  // User Profile State - Iniciando com a imagem do Lobo
  const [userName] = useState("Byte");
  const [profileImage, setProfileImage] = useState<string | null>(DEFAULT_PROFILE_IMAGE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoadingExtract, setIsLoadingExtract] = useState(false);

  // Merge raw data with intelligence
  const transactions: EnrichedTransaction[] = useMemo(() => {
    return RAW_DATA.map((item) => ({
      ...item,
      ...(GEMINI_INTELLIGENCE[item.id] || {
        cleanName: item.rawDescription,
        category: 'Outros',
        emoji: '📝',
        sentiment: 'Neutro'
      }),
    }));
  }, []);

  // Calculate Balance
  const balance = transactions.reduce((acc, curr) => acc + curr.value, 0);
  const income = transactions.filter(t => t.type === 'credit').reduce((acc, curr) => acc + curr.value, 0);
  const expenses = transactions.filter(t => t.type === 'debit').reduce((acc, curr) => acc + Math.abs(curr.value), 0);

  const handleAskLia = async () => {
    setActiveFeature('lia');
    if (analysis) return; // Don't regenerate if already exists for this session

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Você é a LIA, assistente financeira pessoal do app FinHub FMU.
        Analise os seguintes dados financeiros do usuário Byte (em formato JSON) e forneça um resumo curto e amigável.
        
        Dados: ${JSON.stringify(transactions)}
        
        Sua resposta deve conter:
        1. Um cumprimento amigável usando o nome LIA falando com o Byte.
        2. Uma análise rápida dos gastos (destaque categorias onde gastou mais).
        3. Uma dica de economia baseada nos dados (ex: muitos gastos supérfluos).
        4. Use emojis e formatação Markdown simples (negrito, listas).
        5. Seja concisa.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysis(response.text);
    } catch (error) {
      console.error("Erro ao consultar LIA:", error);
      setAnalysis("Desculpe, estou com dificuldades para conectar aos meus servidores neurais agora. Tente novamente mais tarde! 🤖");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateExtract = () => {
    setIsLoadingExtract(true);
    setTimeout(() => {
      setIsLoadingExtract(false);
      alert("Simulação: Mais transações seriam carregadas aqui.");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col font-sans text-gray-900">
      
      {/* 
        Responsive Layout Strategy:
        - Mobile: Full width
        - Desktop: Centered container (max-w-6xl)
      */}
      
      {/* Header Section */}
      <header className="bg-indigo-600 text-white shadow-lg relative overflow-hidden shrink-0 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
             <div className="absolute top-10 -left-10 w-48 h-48 bg-indigo-400 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-8 pb-16 relative z-10">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                <span className="font-bold text-xl text-white">F</span>
              </div>
              <div className={`transition-all duration-300 ${isSearchOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                <h1 className="text-xl font-bold tracking-tight leading-none">FinHub FMU</h1>
                <p className="text-xs text-indigo-200 font-light">Financial Management Unit</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className={`flex items-center bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300 ${isSearchOpen ? 'w-full md:w-64 px-3' : 'w-10 h-10 justify-center'}`}>
                {isSearchOpen && (
                  <input 
                    type="text" 
                    placeholder="Buscar transações..." 
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-indigo-200 mr-2"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                )}
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`${isSearchOpen ? 'p-1' : 'w-full h-full flex items-center justify-center'}`}
                >
                  <Search size={20} />
                </button>
              </div>

              <button 
                onClick={() => setActiveFeature('notifications')}
                className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all relative"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full border border-indigo-600 animate-pulse"></span>
              </button>

              {/* Profile Section */}
              <div className="flex items-center gap-3 ml-2 pl-2 border-l border-white/10">
                <div className="hidden md:block text-right">
                   <p className="text-xs text-indigo-200">Olá,</p>
                   <p className="font-semibold leading-none">{userName}</p>
                </div>
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title="Alterar foto de perfil"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white/30 overflow-hidden flex items-center justify-center shadow-md">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-white">{userName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload size={14} className="text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleProfileImageUpload} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Balance & Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            
            {/* Balance Info */}
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1 opacity-90">Saldo Total Disponível</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                R$ {balance.toFixed(2).replace('.', ',')}
              </h2>

              <div className="flex gap-4 max-w-md">
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/15 transition-colors cursor-default">
                  <div className="p-2.5 bg-green-400/20 rounded-xl text-green-300">
                    <ArrowUpCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Entradas</p>
                    <p className="font-semibold text-lg">R$ {income.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/15 transition-colors cursor-default">
                  <div className="p-2.5 bg-red-400/20 rounded-xl text-red-300">
                    <ArrowDownCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Saídas</p>
                    <p className="font-semibold text-lg">R$ {expenses.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Call to Action (Desktop) */}
            <div className="hidden md:flex justify-end">
               <button 
                onClick={handleAskLia}
                className="group flex items-center gap-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white p-2 pr-6 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
               >
                 <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                   <Sparkles size={24} className="group-hover:animate-spin-slow" />
                 </div>
                 <div className="text-left">
                   <p className="font-bold text-lg">Análise com LIA</p>
                 </div>
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 -mt-8 pb-24 z-20">
        
        {/* Quick Actions (Floating on Mobile / Grid on Desktop) */}
        <div className="flex gap-4 justify-center md:justify-start mb-8">
           <button 
            onClick={() => setActiveFeature('pix')}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg text-indigo-600 font-semibold hover:bg-gray-50 hover:scale-105 transition-all active:scale-95 border border-gray-100"
           >
              <ScanLine size={20} />
              <span>Pix e Transferências</span>
           </button>
           {/* Mobile Only LIA Button */}
           <button 
            onClick={handleAskLia}
            className="md:hidden flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-full shadow-lg text-white font-semibold hover:brightness-110 active:scale-95"
           >
              <Sparkles size={20} />
              <span>LIA AI</span>
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Transactions List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-gray-800">Histórico Recente</h3>
                <button 
                  onClick={handleSimulateExtract}
                  disabled={isLoadingExtract}
                  className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                  {isLoadingExtract ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Carregando...
                    </>
                  ) : (
                    "Ver extrato completo"
                  )}
                </button>
              </div>

              <div className="space-y-8">
                {['26 NOV', '25 NOV', '24 NOV'].map(date => {
                  const groupTransactions = transactions.filter(t => t.date === date);
                  if (groupTransactions.length === 0) return null;

                  return (
                    <div key={date}>
                      <div className="flex items-center gap-4 mb-4">
                         <div className="h-px bg-gray-200 flex-1"></div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{date}</p>
                         <div className="h-px bg-gray-200 flex-1"></div>
                      </div>
                      <div className="grid gap-3">
                        {groupTransactions.map(transaction => (
                          <TransactionCard key={transaction.id} data={transaction} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar / Desktop Widgets */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
               <h3 className="font-bold text-lg mb-2">Cartão Virtual</h3>
               <p className="text-gray-400 text-sm mb-6">Use online com segurança</p>
               <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 mb-4 transition-colors group-hover:bg-white/15">
                  <div className="flex justify-between mb-4">
                    <span className="font-mono text-xl tracking-wider">•••• 8829</span>
                    <ScanLine size={24} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>VAL 12/29</span>
                    <span>CVC •••</span>
                  </div>
               </div>
               <button 
                  onClick={() => setActiveFeature('card')}
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                 Ver detalhes
               </button>
            </div>

            {/* Static Analytics Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-800 mb-4">Gastos por Categoria</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">🚗</div>
                     <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                           <span className="font-medium text-gray-700">Transporte</span>
                           <span className="font-bold text-gray-900">25%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-1/4 rounded-full"></div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">🍔</div>
                     <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                           <span className="font-medium text-gray-700">Alimentação</span>
                           <span className="font-bold text-gray-900">45%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-orange-500 w-[45%] rounded-full"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* LIA Modal */}
      {activeFeature === 'lia' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setActiveFeature(null)}></div>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh] animate-slide-up">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                  <Sparkles size={24} className="text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">LIA Intelligence</h3>
                  <p className="text-indigo-100 text-sm">Assistente Pessoal</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveFeature(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                  <h4 className="font-semibold text-gray-900 text-lg">Analisando suas finanças...</h4>
                  <p className="text-gray-500 text-sm max-w-xs mt-2">A LIA está identificando padrões e calculando suas tendências de consumo.</p>
                </div>
              ) : (
                <div className="prose prose-indigo prose-sm w-full max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                    {analysis && analysis.split(/\*\*(.*?)\*\*/g).map((part, index) => 
                      index % 2 === 1 ? <strong key={index} className="font-bold text-indigo-900">{part}</strong> : part
                    )}
                  </div>
                </div>
              )}
            </div>
            {!isAnalyzing && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setActiveFeature(null)}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Entendi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pix Modal */}
      {activeFeature === 'pix' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setActiveFeature(null)}></div>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2"><ScanLine className="text-indigo-600"/> Área Pix</h3>
              <button onClick={() => setActiveFeature(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="p-8 grid grid-cols-3 gap-4">
               <button className="flex flex-col items-center gap-3 group">
                 <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <Send size={24}/>
                 </div>
                 <span className="text-sm font-medium text-gray-600">Pagar</span>
               </button>
               <button className="flex flex-col items-center gap-3 group">
                 <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <Smartphone size={24}/>
                 </div>
                 <span className="text-sm font-medium text-gray-600">Receber</span>
               </button>
               <button className="flex flex-col items-center gap-3 group">
                 <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <Copy size={24}/>
                 </div>
                 <span className="text-sm font-medium text-center text-gray-600">Copia e Cola</span>
               </button>
            </div>
            <div className="bg-gray-50 p-6">
                <p className="text-xs text-center text-gray-400">Chave aleatória cadastrada</p>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Card Modal */}
      {activeFeature === 'card' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setActiveFeature(null)}></div>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Cartão Virtual</h3>
              <button onClick={() => setActiveFeature(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="w-full h-48 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden mb-6">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                 <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-5 bg-yellow-400 rounded"></div>
                     <span className="font-mono text-sm opacity-80">FinHub Gold</span>
                   </div>
                   <span className="font-bold italic">VISA</span>
                 </div>
                 <p className="font-mono text-xl tracking-widest mb-4">4556 8829 1002 9933</p>
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70 uppercase">Titular</p>
                      <p className="font-medium uppercase">{userName}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70 uppercase text-right">Validade</p>
                      <p className="font-medium">12/29</p>
                    </div>
                 </div>
              </div>
              
              <div className="w-full space-y-3">
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500">Número do cartão</span>
                    <span className="font-medium text-indigo-600 flex items-center gap-2 cursor-pointer hover:text-indigo-800">
                      Copiar <Copy size={14}/>
                    </span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500">CVV</span>
                    <span className="font-bold text-gray-900">342</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {activeFeature === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setActiveFeature(null)}></div>
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-slide-up mt-16 mr-0 md:mr-10 border border-gray-100">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-gray-800">Notificações</h3>
               <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">3 Novas</span>
             </div>
             <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                   <div className="flex gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Pix recebido</p>
                        <p className="text-xs text-gray-500 mt-1">Maria Silva enviou R$ 150,00</p>
                        <p className="text-[10px] text-gray-400 mt-2">24 Nov, 14:30</p>
                      </div>
                   </div>
                </div>
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                   <div className="flex gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Alerta de Gasto</p>
                        <p className="text-xs text-gray-500 mt-1">Você gastou 45% do seu orçamento de Alimentação.</p>
                        <p className="text-[10px] text-gray-400 mt-2">26 Nov, 19:20</p>
                      </div>
                   </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                   <div className="flex gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">LIA está pronta!</p>
                        <p className="text-xs text-gray-500 mt-1">Sua análise semanal de finanças já está disponível.</p>
                        <p className="text-[10px] text-gray-400 mt-2">Hoje, 09:00</p>
                      </div>
                   </div>
                </div>
             </div>
             <button className="w-full py-3 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50 border-t border-gray-100">
               Marcar todas como lidas
             </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;