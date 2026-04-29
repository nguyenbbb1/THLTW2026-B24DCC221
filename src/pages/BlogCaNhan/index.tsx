import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { AppstoreOutlined, UserOutlined, SettingOutlined, TagsOutlined } from '@ant-design/icons';
import moment from 'moment';

import TrangChu from './TrangChu';
import ChiTietBaiViet from './ChiTietBaiViet';
import TrangGioiThieu from './TrangGioiThieu';
import QuanLyBaiViet from './QuanLyBaiViet';
import QuanLyThe from './QuanLyThe';

import { mockPosts, mockTags, mockAuthor } from './mockData';
import { Post, Tag } from './types';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const STORAGE_KEYS = {
  POSTS: 'blog_posts_data',
  TAGS: 'blog_tags_data',
};

const BlogApp: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      return savedPosts ? JSON.parse(savedPosts) : mockPosts;
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu Posts từ Local Storage:", error);
      return mockPosts;
    }
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    try {
      const savedTags = localStorage.getItem(STORAGE_KEYS.TAGS);
      return savedTags ? JSON.parse(savedTags) : mockTags;
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu Tags từ Local Storage:", error);
      return mockTags;
    }
  });

  const author = mockAuthor;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  }, [tags]);

  const handleViewPost = (id: string) => {
    setSelectedPostId(id);
    setActiveMenu('detail');
  };

  const handleIncrementView = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, views: p.views + 1 } : p));
  };

  const handleAddPost = (newPost: Omit<Post, 'id' | 'views' | 'createdAt'>) => {
    const post: Post = {
      ...newPost,
      id: `p${Date.now()}`,
      views: 0,
      createdAt: moment().format('YYYY-MM-DD'),
      author: author.name
    };
    setPosts([post, ...posts]);
  };

  const handleEditPost = (id: string, updatedPost: Partial<Post>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updatedPost } : p));
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddTag = (name: string) => {
    setTags([...tags, { id: `t${Date.now()}`, name, count: 0 }]);
  };

  const handleEditTag = (id: string, name: string) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, name } : t));
  };

  const handleDeleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const renderContent = () => {
    if (activeMenu === 'detail' && selectedPostId) {
      const currentPost = posts.find(p => p.id === selectedPostId);
      if (currentPost) {
        return (
          <ChiTietBaiViet
            post={currentPost}
            allPosts={posts}
            onBack={() => { setActiveMenu('home'); setSelectedPostId(null); }}
            onViewIncrement={handleIncrementView}
            onNavigateRelated={handleViewPost}
          />
        );
      }
    }

    switch (activeMenu) {
      case 'home':
        return <TrangChu posts={posts} tags={tags} onViewDetail={handleViewPost} />;
      case 'about':
        return <TrangGioiThieu author={author} />;
      case 'manage-posts':
        return <QuanLyBaiViet posts={posts} tags={tags} onAddPost={handleAddPost} onEditPost={handleEditPost} onDeletePost={handleDeletePost} />;
      case 'manage-tags':
        const updatedTags = tags.map(tag => ({
          ...tag,
          count: posts.filter(p => p.tags.includes(tag.name)).length
        }));
        return <QuanLyThe tags={updatedTags} onAddTag={handleAddTag} onEditTag={handleEditTag} onDeleteTag={handleDeleteTag} />;
      default:
        return <TrangChu posts={posts} tags={tags} onViewDetail={handleViewPost} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" collapsible>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0, color: '#D93523' }}>MY BLOG</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenu === 'detail' ? 'home' : activeMenu]}
          onClick={(e) => {
            setActiveMenu(e.key);
            setSelectedPostId(null);
          }}
        >
          <Menu.Item key="home" icon={<AppstoreOutlined />}>Trang chủ</Menu.Item>
          <Menu.Item key="about" icon={<UserOutlined />}>Giới thiệu</Menu.Item>
          <Menu.Item key="manage-posts" icon={<SettingOutlined />}>Quản lý bài viết</Menu.Item>
          <Menu.Item key="manage-tags" icon={<TagsOutlined />}>Quản lý thẻ</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px #f0f1f2' }}>
          <Title level={3} style={{ lineHeight: '64px', margin: 0 }}>
            {activeMenu === 'home' && !selectedPostId ? 'Danh sách bài viết'
              : activeMenu === 'about' ? 'Giới thiệu tác giả'
              : activeMenu === 'manage-posts' ? 'Hệ thống Quản lý Bài viết'
              : activeMenu === 'manage-tags' ? 'Hệ thống Quản lý Thẻ'
              : 'Chi tiết bài viết'}
          </Title>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#f4f7f9', minHeight: 280 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BlogApp;