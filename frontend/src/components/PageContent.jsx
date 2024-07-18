export default function PageContent({title, children}) {
    return(
        <div>
            <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-blue-200">{title}</h1>
            {children}
        </div>
    )
}