import '../styles/globals.css'
import AnimatedFrame from '../components/AnimatedFrame'
import MobileOrientationPrompt from '../components/MobileOrientationPrompt'

export const metadata = {
  title: 'George Tatevosov | DevOps Engineer',
  description: 'DevOps Engineer & Technical Lead - Infrastructure automation at scale',
  keywords: ['DevOps', 'Kubernetes', 'Docker', 'AWS', 'Infrastructure', 'Automation'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MobileOrientationPrompt />
        {children}
      </body>
    </html>
  )
}
