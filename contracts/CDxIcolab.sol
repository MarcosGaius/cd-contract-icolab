// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CDxIcolab is ERC721, AccessControl, ERC721Enumerable, ERC721URIStorage {
  uint256 public MAX_SUPPLY = 0;
  string BASE_URI = "";
  string CONTRACT_URI = "";

  using Counters for Counters.Counter;
  Counters.Counter private _tokensIds;

  constructor(address secondOwner, uint256 maxSupply, string memory initialContractURI, string memory initialBaseURI) ERC721("colecionavel.digital X iCoLab", "CDICOLAB") {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(DEFAULT_ADMIN_ROLE, secondOwner);
    
    MAX_SUPPLY = maxSupply;
    CONTRACT_URI = initialContractURI;
    BASE_URI =  initialBaseURI;
  }

  function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual override(ERC721, ERC721Enumerable) {
    return super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function setAdmin(address to) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _grantRole(DEFAULT_ADMIN_ROLE, to);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
    return ERC721._burn(tokenId);
  }

  function mint(address to) public onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256){
    require(totalSupply() + 1 <= MAX_SUPPLY, "Max supply exceeded");

    uint256 tokenId = _tokensIds.current();

    _safeMint(to, tokenId);

    _tokensIds.increment();
    return 5;
  }

  function batchMint(address[] memory to) public onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256[] memory) {
    require(totalSupply() + to.length <= MAX_SUPPLY, "Max supply exceeded");

    uint256[] memory mintedTokens = new uint256[](to.length);

    for(uint256 i = 0; i < to.length; i++) {
      mintedTokens[i] = (mint(to[i]));
    }

    return mintedTokens;
  }

  function setSupply(uint256 newSupply) public onlyRole(DEFAULT_ADMIN_ROLE) returns(uint256){
    MAX_SUPPLY = newSupply;
    return newSupply;
  }

  function contractURI() public view returns (string memory) {
    return CONTRACT_URI;
  }

  function setContractURI(string memory newContractURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
    CONTRACT_URI = newContractURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
      _requireMinted(tokenId);

      string memory baseURI = _baseURI();
      return bytes(baseURI).length > 0 ? string(baseURI) : "";
  }

  function setBaseURI(string memory newBaseURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
    BASE_URI = newBaseURI;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return BASE_URI;
  }

}