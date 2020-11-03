
# notes

* [build_process](build_process)

* [lib_dir](lib_dir)


# todos


# 
-> Set
* 两种Set
  * Complete Set, includes any elements
  * Empty Set, include no element


-> tf-idf
  * 用于计算某个单词的在一组文档中的重要性
  * https://zh.wikipedia.org/wiki/Tf-idf, 这个链接解释的很清楚


* [余弦相似性](https://zh.wikipedia.org/wiki/%E4%BD%99%E5%BC%A6%E7%9B%B8%E4%BC%BC%E6%80%A7)
  * lib/vector.js 又实现, 只不过并没有严格按照wiki中的定义来做
  * [点积(dot production)](https://zh.wikipedia.org/wiki/%E7%82%B9%E7%A7%AF)
    * 结论就是 dot production 是向量A在向量B上投影与向量B长度的乘机
    * 上面链接论证的很明白, 
    * 上面对于向量|v|, 标量求解也很明白 `sqr(x^2, y^2, z^2)`, 在`由代数定义推出几何定义` 一节中

  * [标准正交基](https://zh.wikipedia.org/wiki/%E6%A0%87%E5%87%86%E6%AD%A3%E4%BA%A4%E5%9F%BA) 
    * 在欧几里德空间中标准正交基即是x, y, z 上长度为1的向量. 在此空间中, 所有的向量都是其组合.
    *
  * [欧几里德空间](https://zh.wikipedia.org/wiki/%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E7%A9%BA%E9%97%B4)

-> Levenshtein Distance
  * 计算两个字符串的相似度, 动态规划的思想
  * Levenshtein Distance and the concept of Fuzzy matching in Python - https://medium.com/analytics-vidhya/fuzzy-matching-in-python-2def168dee4a
    * 这里边给了数学公式 
  * 这里边给了 matrix 的图 - https://medium.com/@julientregoat/an-introduction-to-fuzzy-string-matching-178805cca2ab
  * 各种语言的实现版本 -  http://rosettacode.org/wiki/Levenshtein_distance#Rust


  ```rust
  fn main() {
      println!("{}", levenshtein_distance("kitten", "sitting"));
      println!("{}", levenshtein_distance("saturday", "sunday"));
      println!("{}", levenshtein_distance("rosettacode", "raisethysword"));
  }
  
  fn levenshtein_distance(word1: &str, word2: &str) -> usize {
      let w1 = word1.chars().collect::<Vec<_>>();
      let w2 = word2.chars().collect::<Vec<_>>();
  
      let word1_length = w1.len() + 1;
      let word2_length = w2.len() + 1;
  
      let mut matrix = vec![vec![0; word1_length]; word2_length];
  
      for i in 1..word1_length { matrix[0][i] = i; }
      for j in 1..word2_length { matrix[j][0] = j; }
  
      for j in 1..word2_length {
          for i in 1..word1_length {
              let x: usize = if w1[i-1] == w2[j-1] {
                  matrix[j-1][i-1]
              } else {
                  1 + std::cmp::min(
                          std::cmp::min(matrix[j][i-1], matrix[j-1][i])
                          , matrix[j-1][i-1])
              };
              matrix[j][i] = x;
          }
      }
      matrix[word2_length-1][word1_length-1]
  }
  ```

