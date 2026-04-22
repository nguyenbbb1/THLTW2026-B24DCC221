import React, { useState, useCallback } from 'react';
import { List, Card, Input, Tag, Space, Typography, Avatar } from 'antd';
import { Post, Tag as TagType } from './types';
import debounce from 'lodash/debounce';
import { getTagColor } from './SharedStyles';
import { mockAuthor } from './mockData'; // Import dữ liệu tác giả để đồng bộ ảnh đại diện

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

interface Props {
  posts: Post[];
  tags: TagType[];
  onViewDetail: (postId: string) => void;
}

const TrangChu: React.FC<Props> = ({ posts, tags, onViewDetail }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  const handleTagClick = (tagName: string) => {
    setSelectedTag(prev => (prev === tagName ? null : tagName));
  };

  const filteredPosts = posts.filter(post => {
    if (post.status !== 'Đã đăng') return false;
    const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchSearch && matchTag;
  });

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Search
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
              onChange={onChangeSearch}
              allowClear
              size="large"
            />
            <Space wrap>
              <Text strong>Lọc theo thẻ:</Text>
              {tags.map(tag => (
                <Tag.CheckableTag
                  key={tag.id}
                  checked={selectedTag === tag.name}
                  onChange={() => handleTagClick(tag.name)}
                >
                  {tag.name}
                </Tag.CheckableTag>
              ))}
            </Space>
          </Space>
        </Card>

        <List
          grid={{ gutter: 24, column: 3 }}
          dataSource={filteredPosts}
          pagination={{ pageSize: 9, align: 'center' }}
          renderItem={post => (
            <List.Item>
              <Card
                hoverable
                cover={<img alt={post.title} src={post.avatarUrl} style={{ height: 200, objectFit: 'cover' }} />}
                onClick={() => onViewDetail(post.id)}
                style={{ height: '100%' }}
              >
                <Card.Meta
                  title={<Title level={4} ellipsis={{ rows: 2 }}>{post.title}</Title>}
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 3 }}>{post.summary}</Paragraph>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space>
                          {/* SỬA LỖI: Sử dụng ảnh đại diện đồng bộ từ mockAuthor thay vì API ngẫu nhiên */}
                          <Avatar size="small" src={mockAuthor.avatar} />
                          <Text type="secondary">{post.author} • {post.createdAt}</Text>
                        </Space>
                        <Space wrap>
                          {post.tags.map(tag => (
                            <Tag color={getTagColor(tag)} key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                      </Space>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Space>
    </div>
  );
};

export default TrangChu;