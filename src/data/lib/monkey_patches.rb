class Hash
  def compact
    self.each_with_object({}) do |kv, h|
      k,v = kv
      h[k] = v if v
    end
  end
end

class Array
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
end

