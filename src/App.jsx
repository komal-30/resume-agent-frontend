import { useState } from 'react'
import { Mic, MessageSquare, BrainCircuit } from 'lucide-react'
import VoiceAgent from './components/VoiceAgent/VoiceAgent'
import TextChat from './components/TextChat/TextChat'
import './App.css'

const TABS = [
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'chat',  label: 'Chat',  icon: MessageSquare },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('voice')

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <BrainCircuit size={26} className="brand-icon" />
          <div>
            <h1 className="brand-title">Resume Agent</h1>
            <p className="brand-subtitle">AI-powered resume assistant</p>
          </div>
        </div>

        <nav className="tab-nav">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`tab-btn${activeTab === id ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'voice' ? <VoiceAgent /> : <TextChat />}
      </main>
    </div>
  )
}
