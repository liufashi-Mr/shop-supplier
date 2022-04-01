export default function revertUTF8(szInput) {
    var x, wch, wch1, wch2, uch = "", szRet = "";
    for (x = 0; x < szInput.length; x++) {
        if (szInput.charAt(x) == "%") {
            wch = parseInt(szInput.charAt(++x) + szInput.charAt(++x), 16);
            if (!wch) { break; }
            if (!(wch & 0x80)) {
                wch = wch;
            } else if (!(wch & 0x20)) {
                x++;
                wch1 = parseInt(szInput.charAt(++x) + szInput.charAt(++x), 16);
                wch = (wch & 0x1F) << 6;
                wch1 = wch1 & 0x3F;
                wch = wch + wch1;
            } else {
                x++;
                wch1 = parseInt(szInput.charAt(++x) + szInput.charAt(++x), 16);
                x++;
                wch2 = parseInt(szInput.charAt(++x) + szInput.charAt(++x), 16);
                wch = (wch & 0x0F) << 12;
                wch1 = (wch1 & 0x3F) << 6;
                wch2 = (wch2 & 0x3F);
                wch = wch + wch1 + wch2;
            }
            szRet += String.fromCharCode(wch);
        } else {
            szRet += szInput.charAt(x);
        }
    }
    return (szRet);
}
