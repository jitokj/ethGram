//// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

contract Ethgram {
    string public name = "EthGram";

//store images
    struct Image {
        uint id;
        uint tipAmount;
        string hashes;
        string description;
        address payable author;
    }
    

    uint public imageCount = 0;
    mapping(uint => Image) public images;

     
        event ImageCreated (
        uint id,
        uint tipAmount,
        string hashes,
        string description,
        address payable author
        );

        event ImageTipped (
        uint id,
        uint tipAmount,
        string hashes,
        string description,
        address payable author
        );

     // create images
    function uploadImage(string memory _imageHash,string memory _description) public {
        require(bytes(_imageHash).length > 0,"Ipfs hash is not valid");
        require(bytes(_description).length > 0,"description should not be empty");
        require(msg.sender != address(0x0));
        imageCount++;
        images[imageCount] = Image(imageCount,0,_imageHash,_description,msg.sender);
        emit ImageCreated(imageCount,0,_imageHash,_description,msg.sender);
    }

    // tip images

    function tipImageOwner(uint _id) public payable {
        require(_id > 0 && _id <= imageCount);
        Image memory _image = images[_id];
        address payable _author = _image.author;
        _image.tipAmount = _image.tipAmount + msg.value;
        images[_id] = _image;
        address(_author).transfer(msg.value);
        emit ImageTipped(_id,_image.tipAmount,_image.hashes,_image.description,_image.author);
    }
}
