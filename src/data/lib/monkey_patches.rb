class Object
  def deep_dup
    duplicable? ? dup : self
  end

  def duplicable?
    true
  end
end

class Hash
  def compact
    self.each_with_object({}) do |kv, h|
      k,v = kv
      h[k] = v if v
    end
  end

  def duplicable?
    false
  end

  def deep_dup
    hash = dup
    each_pair do |key, value|
      if key.frozen?
        hash[key] = value.deep_dup
      else
        hash.delete(key)
        hash[key.deep_dup] = value.deep_dup
      end
    end
    hash
  end

  def deep_merge(other_hash, &block)
    dup.deep_merge!(other_hash, &block)
  end

  def deep_merge!(other_hash, &block)
    merge!(other_hash) do |key, this_val, other_val|
      if this_val.is_a?(Hash) && other_val.is_a?(Hash)
        this_val.deep_merge(other_val, &block)
      elsif block_given?
        block.call(key, this_val, other_val)
      else
        other_val
      end
    end
  end
end

class Array
  def duplicable?
    false
  end

  def deep_dup
    map { |it| it.deep_dup }
  end

  def compact_join
    if self.any?{|item| not item.nil? and item.size > 0}
      self.join
    else
      nil
    end
  end
end

class String
  def snake_case
    self.gsub(/::/, '/').
    gsub(/([A-Z]+)([A-Z][a-z])/,'\1_\2').
    gsub(/([a-z\d])([A-Z])/,'\1_\2').
    gsub(/\s+/,'_').
    tr("-", "_").
    downcase
  end

  def kabab_case
    snake_case.gsub('_', '-')
  end
end

