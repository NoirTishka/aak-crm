export function DraggableBar() {
    const noDrag = {['-webkit-app-region']: 'no-drag'} as React.CSSProperties;
    const drag = {['-webkit-app-region']: 'drag'} as React.CSSProperties;
    
    return (
        <div
        className="h-10 w-full bg-gray-800 flex items-center justify-between px-4"
        style={drag}
        
        >
        <div className="text-white font-semibold select-none">T'chnologies</div>

            <div className="flex gap-1" style={noDrag}>
                <button
                onClick={() => window.api.minimize()}
                className="window-button w-10 h-8 flex items-center justify-center text-sm !bg-gray-800 hover:!bg-gray-900 text-white rounded p-0"
                >
                –
                </button>
                <button
                onClick={() => window.api.maximize()}
                className="window-button w-10 h-8 flex items-center justify-center text-sm !bg-gray-800 hover:!bg-gray-900 text-white rounded p-0"
                >
                ▢
                </button>
                <button
                onClick={() => window.api.close()}
                className="window-button w-10 h-8 flex items-center justify-center text-sm !bg-gray-800 hover:!bg-[#cc4c4c] text-white rounded p-0"
                >
                ✕
                </button>
            </div>
        </div>
    );
    }