// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "interfaces/ITenexOracle.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title PriceFetcher
/// @notice A wrapper contract for TenexOracle. It emits events for fetched prices.
/// @dev The emitted events, incl. the token address and the fetched price, are indexed
/// on Dune Analytics. The events serve as price feeds for tokens live on Tenexdrome pools.
/// The table name is Tenexdrome_v2_blast.PriceFetcher_evt_PriceFetched on Dune.
contract PriceFetcher {
    ITenexOracle public oracle;
    address public owner;
    mapping(address => bool) public callers;
    IERC20Metadata[] private source_tokens;
    IERC20Metadata[] private connectors;
    IERC20Metadata private USDC;

    function get_tokens(bool is_connector) public view returns (address[] memory results) {
        IERC20Metadata[] storage arr = is_connector ? connectors : source_tokens;
        results = new address[](arr.length);
        for (uint256 i = 0; i < arr.length; i++) {
            results[i] = address(arr[i]);
        }
    }

    function add_tokens(bool is_connector, address[] calldata _tokens) public {
        _only_owner();
        IERC20Metadata[] storage arr = is_connector ? connectors : source_tokens;
        for (uint256 i = 0; i < _tokens.length; i++) {
            arr.push(IERC20Metadata(_tokens[i]));
        }
    }

    function remove_tokens(bool is_connector, uint256[] calldata _indices) public {
        _only_owner();
        IERC20Metadata[] storage arr = is_connector ? connectors : source_tokens;
        for (uint256 i = 0; i < _indices.length; i++) {
            arr[_indices[i]] = arr[arr.length - 1];
            arr.pop();
        }
    }

    function change_USDC(address _USDC) public {
        _only_owner();
        USDC = IERC20Metadata(_USDC);
    }

    function _construct_oracle_args(uint256 _src_len, uint256 _src_offset)
        internal
        view
        returns (IERC20Metadata[] memory oracle_args)
    {
        oracle_args = new IERC20Metadata[]( _src_len + connectors.length + 1);
        for (uint256 i = _src_offset; i < _src_offset + _src_len; i++) {
            oracle_args[i - _src_offset] = source_tokens[i];
        }
        for (uint256 i = _src_len; i < oracle_args.length - 1; i++) {
            oracle_args[i] = connectors[i - _src_len];
        }
        oracle_args[oracle_args.length - 1] = USDC;
    }

    /// @notice Emitted when a price for a token is fetched.
    /// @param token The address of the token.
    /// @param price The fetched price of the token.
    event PriceFetched(address indexed token, uint256 price);

    /// @notice Creates a new PriceFetcher contract.
    /// @param _oracle The address of the TenexOracle to use for fetching prices.
    constructor(ITenexOracle _oracle, address _USDC) {
        oracle = _oracle;
        owner = msg.sender;
        USDC = IERC20Metadata(_USDC);
    }

    function _only_owner() internal view {
        require(msg.sender == owner);
    }

    /// @notice Adds a caller to the callers set.
    /// @dev Can only be called by the owner.
    /// @param _caller The address to be added.
    function add_caller(address _caller) public {
        _only_owner();
        callers[_caller] = true;
    }

    /// @notice Removes an caller from callers set.
    /// @dev Can only be called by the owner.
    /// @param _caller The address to be removed.
    function remove_caller(address _caller) public {
        _only_owner();
        callers[_caller] = false;
    }

    /// @notice Changes the owner of the contract.
    /// @dev Can only be called by the current owner.
    /// @param _owner The address of the new owner.
    function change_owner(address _owner) public {
        _only_owner();
        owner = _owner;
    }

    /// @notice Changes the oracle used for fetching prices.
    /// @dev Can only be called by the current owner.
    /// @param _oracle The address of the new TenexOracle.
    function change_oracle(ITenexOracle _oracle) public {
        _only_owner();
        oracle = _oracle;
    }

    /// @notice Fetches prices for a list of tokens.
    /// @dev Can only be called by the owner. Emits a PriceFetched event for each token.
    /// @param _src_len The number of source tokens to fetch prices for.
    /// @param _src_offset The number of source tokens to skip.
    function fetchPrices(uint256 _src_len, uint256 _src_offset) public {
        require(msg.sender == owner || callers[msg.sender]);

        uint256[] memory prices =
            oracle.getManyRatesWithConnectors(uint8(_src_len), _construct_oracle_args(_src_len, _src_offset));


        for (uint256 i = _src_offset; i < _src_offset + _src_len; i++) {
            emit PriceFetched(address(source_tokens[i]), prices[i - _src_offset]);
        }
    }
}