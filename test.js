const base64url = require( "base64url");



function getUrlEncode(Url) {
    let UrlEncode;
    if (Url) {
        UrlEncode = base64url.encode(Url) + "=";
    }
    return UrlEncode;
}

function test(){
    let data = {
        property: "123",
        name: "234"
    };
    let encoded = getUrlEncode(JSON.stringify(data));
    console.log(encoded);
    const UrlDecode = base64url.decode(encoded);
    console.log(UrlDecode);

}

test();