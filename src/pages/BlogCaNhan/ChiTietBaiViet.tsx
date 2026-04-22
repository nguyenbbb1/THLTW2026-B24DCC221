import React, { useEffect } from 'react';
import { Button, Typography, Tag, Space, Divider, Row, Col, Card } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { Post } from './types';
import { styles, getTagColor } from './SharedStyles';

const { Title, Text } = Typography;

interface Props {
  post: Post;
  allPosts: Post[];
  onBack: () => void;
  onViewIncrement: (id: string) => void;
  onNavigateRelated: (id: string) => void;
}

const ChiTietBaiViet: React.FC<Props> = ({ post, allPosts, onBack, onViewIncrement, onNavigateRelated }) => {

  // Tự động tăng lượt xem khi truy cập chi tiết
  useEffect(() => {
    onViewIncrement(post.id);
  }, [post.id, onViewIncrement]);

  // Bộ lọc bài viết liên quan dựa trên Tag
  const relatedPosts = allPosts.filter(p =>
    p.id !== post.id &&
    p.status === 'Đã đăng' &&
    p.tags.some(tag => post.tags.includes(tag))
  ).slice(0, 3);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 20 }}>
          Quay lại danh sách
        </Button>

        <Title level={1}>{post.title}</Title>
        <Space split={<Divider type="vertical" />} style={{ marginBottom: 20 }}>
          <Text strong>{post.author}</Text>
          <Text type="secondary">{post.createdAt}</Text>
          <Space>
            <EyeOutlined />
            <Text>{post.views} lượt xem</Text>
          </Space>
        </Space>

        <div style={{ marginBottom: 20 }}>
          {post.tags.map(tag => <Tag color={getTagColor(tag)} key={tag}>{tag}</Tag>)}
        </div>

        {post.avatarUrl && (
          <img
            src={post.avatarUrl}
            alt="cover"
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', marginBottom: 20 }}
          />
        )}

        <div
          style={{ fontSize: '16px', lineHeight: '1.8', overflowWrap: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Divider />
        <Title level={3}>Bài viết liên quan</Title>
        <Row gutter={[16, 16]}>
          {relatedPosts.length > 0 ? relatedPosts.map(rp => (
            <Col span={8} key={rp.id}>
              <Card hoverable onClick={() => onNavigateRelated(rp.id)} size="small">
                <Card.Meta
                  title={<Text ellipsis>{rp.title}</Text>}
                  description={<Text type="secondary">{rp.createdAt}</Text>}
                />
              </Card>
            </Col>
          )) : <Text type="secondary">Không có bài viết liên quan.</Text>}
        </Row>
      </div>
    </div>
  );
};

export default ChiTietBaiViet;