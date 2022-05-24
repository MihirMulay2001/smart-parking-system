//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

contract SigCheck {
    event ValueReceived(address user, uint256 amount);
    event Print(bytes32);

    function isValidSignature(
        uint256 amount,
        bytes memory signature,
        uint256 nonce,
        address sender,
        address contractAddress,
        address receiver
    ) internal returns (bool) {
        emit Print(0);
        bytes32 message = prefixed(
            keccak256(
                abi.encodePacked(receiver, amount, nonce, contractAddress)
            )
        );
        emit Print(message);
        return recoverSigner(message, signature) == sender;
    }

    function recoverSigner(bytes32 message, bytes memory signature)
        internal
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        // if (v != 27 || v != 28) {
        //     return (receiver);
        // }
        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory signature)
        internal
        pure
        returns (
            uint8 v,
            bytes32 r,
            bytes32 s
        )
    {
        require(signature.length == 65, "Signature is invalid length");
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        if (v < 27) {
            v += 27;
        }
        return (v, r, s);
    }

    function prefixed(bytes32 hashv) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hashv)
            );
    }

    function isMatchingSignature(
        uint256 amount,
        bytes memory signature,
        uint256 nonce,
        address sender,
        address contractAddress,
        address _receiver
    ) public returns (bool) {
        return
            isValidSignature(
                amount,
                signature,
                nonce,
                sender,
                contractAddress,
                _receiver
            );
    }

    fallback() external payable {}

    receive() external payable {
        emit ValueReceived(msg.sender, msg.value);
    }
}
