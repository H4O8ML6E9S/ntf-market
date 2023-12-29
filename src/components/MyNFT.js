/*
 * @Author: 南宫
 * @Date: 2023-12-16 14:39:55
 * @LastEditTime: 2023-12-29 13:32:59
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNFTCard from './MyNFTCard';
import { balanceOf, tokenOfOwnerByIndex } from '../utils/nft';
import '../App.css';
import { Spinner } from 'react-bootstrap'; // 引入Bootstrap组件

const MyNFT = () => {

  // 判断按钮button的显示
  // let walletAddress;
  const [walletAddress, setWalletAddress] = useState(null); // 状态化用户地址

  //获取所有的NFT
  const [nfts, setNfts] = useState([]);
  const navigate = useNavigate();

  // 实现NFT详细页的路由跳转
  const handleCardClick = (tokenId) => {
    navigate(`/mynft-detail/${tokenId}`);
  };

  // 用于页面展示
  const [isEmpty, setIsEmpty] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // 获取该用户所有的NFT
  /*
   1.通过balanceof获取用户拥有的NFT数量
   2.通过tokenOfOwnerByIndex获取tokenId
   3.通过tokenURI获取nft的cid地址
  */
  // 获取该用户所有的NFT
  useEffect(() => {
    const fetchNFTs = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          // console.log(accounts[0]);
          setWalletAddress(accounts[0]); // 更新用户地址
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      }
    };
    fetchNFTs();
  }, []); // 仅在组件挂载时执行一次

  useEffect(() => {
    // 获取所有的nft
    const fetchNFTs = async () => {
      if (walletAddress) { // 确保用户地址已设置
        const length = await balanceOf(walletAddress);
        console.log('length=', length);
        setIsFetching(true); // 开始获取NFT，可以显示加载状态
        if (length === 0) {
          setIsEmpty(true); // 如果列表为空，设置isEmpty为true
        } else {
          const fetchedNFTs = [];
          for (let i = 0; i < length; i++) {
            const tokenId = await tokenOfOwnerByIndex(walletAddress, i);
            fetchedNFTs.push(tokenId);
          }
          setNfts([...new Set(fetchedNFTs)]);
        }
        setIsFetching(false); // 获取NFT结束，取消加载状态
      }
    };
    fetchNFTs();
  }, [walletAddress]); // 当用户地址发生变化时执行


  return (
    <div className="text-center">
      {isFetching && <p>Loading...</p>}
      {isEmpty && (
        <div className="empty-message">
          <h1>空空如也</h1>
        </div>
      )}
      {!isFetching && !isEmpty && (
        <div className="nft-grid">
          {nfts.map(nft => (
            <MyNFTCard key={nft.tokenId} tokenId={nft} onClick={() => handleCardClick(nft)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNFT;