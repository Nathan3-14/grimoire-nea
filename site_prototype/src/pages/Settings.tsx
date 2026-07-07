export default function Settings({backgroundColour, setBackgroundColour}: {backgroundColour: string, setBackgroundColour: CallableFunction}) {
    return <>
        <input type="color" value={backgroundColour} onChange={(e) => setBackgroundColour(e.target.value)} /> {/* sets "backgroundColour" whenever its value changes */}
    </>
}