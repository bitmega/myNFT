pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Color is ERC721, ERC721Enumerable {
  string[] public colors;
  uint public colorCount = 0;
  mapping(string => bool) _colorExists;

  constructor() ERC721("Color", "COLOR") public { }

  function _beforeTokenTransfer(address from, address to, uint tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function mint(string memory _color) public {
    require(!_colorExists[_color], "Color already exists");
    colors.push(_color);
    uint _id = colors.length - 1;
    _mint(msg.sender, _id);
    _colorExists[_color] = true;
  }
}