// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import Link from 'next/link'
// import { Button } from "@/components/ui/button"
// // import { getDictionary } from '../../[lang]/dictionaries';
// import LanguageSwitcher from '../../_components/languageSwitcher';


// const prompts = [
//     { id: 1, title: "Write a blog post about AI trends", popularity: 95 },
//     { id: 2, title: "Generate a Python script for web scraping", popularity: 88 },
//     { id: 3, title: "Create a prompt for a chatbot", popularity: 75 },
//     { id: 4, title: "Summarize a news article", popularity: 70 },
//     { id: 5, title: "Draft an email for customer support", popularity: 65 },
// ];

// export default async function Hero() {
//     const lang = "en";
//     // const dict = await getDictionary(lang as 'en' | 'fr')

//     return (
//         <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-white via-gray-300 to-gray-100 select-none">
//             {/* Navigation */}
//             <nav className="flex items-center justify-between p-4 lg:px-8">
//                 <div className="flex items-center gap-8">
//                     <Link href="/" className="flex items-center gap-2">
//                         <span className="text-black font-bold">Open
//                             <span className='text-red-500'>Prompt</span>
//                         </span>
//                     </Link>
//                     <nav className="hidden md:flex items-center gap-3">
//                         <Button variant="ghost" className="text-gray-500 hover:bg-white/5 hover:text-black">{dict.landing.navigation.trending}</Button>
//                         <Button variant="ghost" className="text-gray-500 hover:bg-white/5 hover:text-black">{dict.landing.navigation.staff_picks}</Button>
//                         <Button variant="ghost" className="text-gray-500 hover:bg-white/5 hover:text-black">{dict.landing.navigation.library}</Button>
//                         <Button variant="ghost" className="text-gray-500 hover:bg-white/5 hover:text-black">{dict.landing.navigation.for_developers}</Button>
//                         <Button variant="ghost" className="text-gray-500 hover:bg-white/5 hover:text-black">{dict.landing.navigation.portal}</Button>
//                     </nav>
//                 </div>
                
//                 <div className="flex items-center gap-4">
//                     <Button className="bg-red-500 hover:bg-red-600 text-white">
//                         {dict.landing.navigation.button}
//                     </Button>
//                 </div>
//             </nav>

//             {/* Hero Section */}
//             <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 sm:py-32 text-center">
//                 <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl max-w-[1024px]">
//                     {dict.landing.hero.header}
//                     <span className="text-red-500 pl-4">{dict.landing.hero.header_color}</span>
//                 </h1>
//                 <LanguageSwitcher />
//                 <p className="mt-6 text-lg leading-8 text-gray-800 max-w-2xl mx-auto">
//                     {dict.landing.hero.description}
//                 </p>
//                 <div className="mt-10 flex items-center justify-center gap-6">
//                     <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
//                         {dict.landing.hero.button_l}
//                     </Button>
//                     <Button size="lg" variant="outline" className="text-gray-800 border">
//                         {dict.landing.hero.button_r}
//                     </Button>
//                 </div>
//             </div>

//             {/* Popular Prompts */}
//             <div className="py-10">
//                 <h2 className="text-center text-xl font-semibold text-black mb-6">{dict.landing.hero.trending_prompts}</h2>
//                 <ul className="flex flex-col items-center space-y-4">
//                     {prompts.map((prompt) => (
//                         <li
//                             key={prompt.id}
//                             className="bg-slate-100 text-gray-800 px-6 py-4 rounded-lg max-w-md w-full shadow-xl hover:bg-red-500 hover:text-white transition-all duration-300"
//                         >
//                             {prompt.title} <span className="text-sm text-gray-400">(Ranked: {prompt.popularity})</span>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }
