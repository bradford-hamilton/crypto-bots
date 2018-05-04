pragma solidity ^0.4.23;

import "./BotBase.sol";
import "./ERC721Basic.sol";

/// @title Manages ownership, ERC-721 (somwhat) compliant.
contract BotOwnership is BotBase, ERC721Basic {
  /// @notice Name and symbol of the non fungible token, as defined in ERC721.
  string public constant name = "CryptoBots";
  string public constant symbol = "CB";

  // Internal utility functions:

  /// @dev Checks if a given address is the current owner of a particular Bot.
  /// @param _claimant the address we are validating against.
  /// @param _tokenId bot id, only valid when > 0
  function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return botIndexToOwner[_tokenId] == _claimant;
  }

  /// @dev Checks if a given address currently has transferApproval for a particular Bot.
  /// @param _claimant the address we are confirming bot is approved for.
  /// @param _tokenId bot id, only valid when > 0
  function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return botIndexToApproved[_tokenId] == _claimant;
  }

  /// @dev Marks an address as being approved for transferFrom(), overwriting any previous
  ///  approval. Setting _approved to address(0) clears all transfer approval.
  function _approve(uint256 _tokenId, address _approved) internal {
    botIndexToApproved[_tokenId] = _approved;
  }

  /// @notice Returns the number of Bots owned by a specific address.
  /// @param _owner The owner address to check.
  function balanceOf(address _owner) public view returns (uint256 count) {
    return ownershipTokenCount[_owner];
  }

  /// @notice Transfers a Bot to another address. If transferring to a smart
  ///  contract be VERY CAREFUL to ensure that it is aware of ERC-721 (or
  ///  CryptoBots specifically) or your Bot may be lost forever.
  /// @param _to The address of the recipient, can be a user or contract.
  /// @param _tokenId The ID of the Bot to transfer.
  function transfer(address _to, uint256 _tokenId) external {
    // Safety check to prevent against an unexpected 0x0 default.
    require(_to != address(0));

    // You can only send your own bot.
    require(_owns(msg.sender, _tokenId));

    // Reassign ownership, clear pending approvals, emit Transfer event.
    _transfer(msg.sender, _to, _tokenId);
  }

  /// @notice Grant another address the right to transfer a specific Bot via
  ///  transferFrom(). This is the preferred flow for transfering NFTs to contracts.
  /// @param _to The address to be granted transfer approval. Pass address(0) to
  ///  clear all approvals.
  /// @param _tokenId The ID of the Bot that can be transferred if this call succeeds.
  /// @dev Required for ERC-721 compliance.
  function approve(address _to, uint256 _tokenId) public {
    // Only an owner can grant transfer approval.
    require(_owns(msg.sender, _tokenId));

    // Register the approval (replacing any previous approval).
    _approve(_tokenId, _to);

    // Emit approval event.
    emit Approval(msg.sender, _to, _tokenId);
  }

  /// @notice Transfer a Bot owned by another address, for which the calling address
  ///  has previously been granted transfer approval by the owner.
  /// @param _from The address that owns the Bot to be transfered.
  /// @param _to The address that should take ownership of the Bot. Can be any address,
  ///  including the caller.
  /// @param _tokenId The ID of the Bot to be transferred.
  function transferFrom(address _from, address _to, uint256 _tokenId) public {
    // Safety check to prevent against an unexpected 0x0 default.
    require(_to != address(0));

    // Check for approval and valid ownership
    require(_approvedFor(this, _tokenId));
    require(_owns(_from, _tokenId));

    // Reassign ownership (also clears pending approvals and emits Transfer event).
    _transfer(_from, _to, _tokenId);
  }

  /// @notice Returns the total number of Bots currently in existence.
  function totalSupply() public view returns (uint) {
    return bots.length - 1;
  }

  /// @notice Returns the address currently assigned ownership of a given Bot.
  function ownerOf(uint256 _tokenId) public view returns (address owner) {
    owner = botIndexToOwner[_tokenId];

    require(owner != address(0));
  }

  /// @notice Returns a list of all Bot IDs assigned to an address.
  /// @param _owner The owner whose Bots we are interested in.
  /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
  ///  expensive (it walks the entire Bot array looking for bots belonging to owner),
  ///  but it also returns a dynamic array, which is only supported for web3 calls, and
  ///  not contract-to-contract calls.
  function tokensOfOwner(address _owner) external view returns(uint256[] ownerTokens) {
    uint256 tokenCount = balanceOf(_owner);

    if (tokenCount == 0) {
      // Return an empty array
      return new uint256[](0);
    } else {
      uint256[] memory result = new uint256[](tokenCount);
      uint256 totalBots = totalSupply();
      uint256 resultIndex = 0;

      // We count on the fact that all bots have IDs starting at 1 and increasing
      // sequentially up to the totalBot count.
      uint256 botId;

      for (botId = 1; botId <= totalBots; botId++) {
        if (botIndexToOwner[botId] == _owner) {
          result[resultIndex] = botId;
          resultIndex++;
        }
      }

      return result;
    }
  }

  /// @notice Returns a Bots dna and birthtime. Cannot return structs at this point
  ///  so it's returning multiple values off the bot struct.
  /// @param _tokenId The index of the bot in question.
  function getTokenByIndex(uint256 _tokenId) public view returns(uint256, uint64) {
    return (bots[_tokenId].dna, bots[_tokenId].birthTime);
  }

  /// @notice Returns owner's address based on bot index.
  /// @param _tokenId The index of the bot in question.
  function getOwnerByIndex(uint256 _tokenId) public view returns(address) {
    return botIndexToOwner[_tokenId];
  }
}
