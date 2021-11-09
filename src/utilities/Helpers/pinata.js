const axios = require("axios");
const FormData = require("form-data");
const PinataJWT = process.env.REACT_APP_PINATA_JWT;
const getApiConfig = async () => {
    const config = {
        headers: {
            "Content-Type": `multipart/form-data`,
            Authorization: `Bearer ${PinataJWT}`,
        }
    };
    return config;
};

export const handleUpload = async (selectedFiles, customName, wrapWithDirectory) => {
    try {
        const data = new FormData();
        if (customName && customName !== '') {
            const metadata = JSON.stringify({
                name: customName
            });
            data.append('pinataMetadata', metadata);
        }

        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                data.append(`file`, file);
            });
        } else {
            data.append('file', selectedFiles, selectedFiles.name);
        }
        if (wrapWithDirectory === true) {
            const pinataOptions = JSON.stringify({
                wrapWithDirectory: true
            });
            data.append('pinataOptions', pinataOptions);
        }
        const res = await axios.post(`https://api.pinata.cloud/pinning/pinFileToIPFS`, data, await getApiConfig());
        return res.data;
    } catch (error) {
        console.log(error);
        //  Handle error
    }
};



